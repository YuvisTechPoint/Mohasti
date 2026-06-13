"use client";

import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useContext, useEffect, useRef, useState } from "react";
import type { Order } from "@/types";
import { AuthContext } from "@/components/providers/AuthProvider";
import { getFirebaseDb, isFirebaseClientConfigured } from "@/lib/firebase/client";
import { normalizeOrders } from "@/lib/order-normalize";

const POLL_MS = 5_000;

export type RealtimeOrdersMode = "live" | "polling" | "idle";

function sortOrders(orders: Order[]): Order[] {
  return [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function stripSensitiveFields(order: Order): Order {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { accessToken, ...rest } = order;
  return rest as Order;
}

async function fetchOrdersFromApi(): Promise<Order[]> {
  const res = await fetch("/api/account/orders", { cache: "no-store" });
  if (!res.ok) {
    throw new Error(
      res.status === 401
        ? "Sign in to view your orders."
        : "Failed to load orders.",
    );
  }
  const data = await res.json();
  return sortOrders(normalizeOrders(data.orders ?? []));
}

export function useRealtimeOrders(userId: string | null | undefined) {
  const auth = useContext(AuthContext);
  const user = auth?.user ?? null;
  const authLoading = auth?.loading ?? false;
  const configured = auth?.configured ?? false;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<RealtimeOrdersMode>("idle");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!userId || authLoading) return;

    let active = true;

    function stopPolling() {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    }

    async function pollOnce() {
      try {
        const next = await fetchOrdersFromApi();
        if (!active) return;
        setOrders(next);
        setError(null);
        setMode("polling");
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load orders.");
      } finally {
        if (active) setLoading(false);
      }
    }

    function startPolling() {
      stopPolling();
      setMode("polling");
      pollOnce();
      pollRef.current = setInterval(pollOnce, POLL_MS);
    }

    const canUseFirestore =
      configured && user?.uid === userId && isFirebaseClientConfigured();

    if (!canUseFirestore) {
      queueMicrotask(() => {
        if (active) setLoading(true);
      });
      startPolling();
      return () => {
        active = false;
        stopPolling();
      };
    }

    queueMicrotask(() => {
      if (active) {
        setLoading(true);
        setError(null);
      }
    });

    const db = getFirebaseDb();
    const q = query(
      collection(db, "orders"),
      where("userId", "==", userId),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!active) return;
        stopPolling();
        const next = sortOrders(
          normalizeOrders(
            snapshot.docs.map((doc) => stripSensitiveFields(doc.data() as Order)),
          ),
        );
        setOrders(next);
        setError(null);
        setMode("live");
        setLoading(false);
      },
      (snapshotError) => {
        console.warn("Firestore orders listener failed, using API polling:", snapshotError);
        if (!active) return;
        startPolling();
      },
    );

    return () => {
      active = false;
      unsubscribe();
      stopPolling();
    };
  }, [userId, authLoading, configured, user?.uid]);

  if (!userId) {
    return {
      orders: [] as Order[],
      loading: false,
      error: null,
      mode: "idle" as RealtimeOrdersMode,
    };
  }

  return { orders, loading: loading || authLoading, error, mode };
}
