"use client";

import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import type { Order } from "@/types";
import { useAuth } from "@/components/providers/AuthProvider";
import { getFirebaseDb, isFirebaseClientConfigured } from "@/lib/firebase/client";
import { orderApiUrl } from "@/lib/order-access-client";

const POLL_MS = 3_000;
const TERMINAL_STATUSES = new Set<Order["status"]>(["paid", "failed"]);

export type RealtimeOrderMode = "live" | "polling" | "idle";

function stripSensitiveFields(order: Order): Order {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { accessToken, ...rest } = order;
  return rest as Order;
}

async function fetchOrderFromApi(
  orderId: string,
  accessToken?: string | null,
): Promise<Order> {
  const res = await fetch(orderApiUrl(orderId, accessToken), {
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? "Order not found.");
  }
  return data.order as Order;
}

export function useRealtimeOrder(
  orderId: string,
  accessToken?: string | null,
) {
  const { user, configured } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<RealtimeOrderMode>("idle");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const firestoreAttached = useRef(false);

  useEffect(() => {
    if (!orderId) return;

    let active = true;
    firestoreAttached.current = false;

    function stopPolling() {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    }

    function attachFirestoreListener() {
      if (firestoreAttached.current || !active) return;
      if (!configured || !isFirebaseClientConfigured() || !user?.uid) return;

      firestoreAttached.current = true;
      stopPolling();

      const db = getFirebaseDb();
      const unsubscribe = onSnapshot(
        doc(db, "orders", orderId),
        (snapshot) => {
          if (!active || !snapshot.exists()) return;
          const next = stripSensitiveFields(snapshot.data() as Order);
          if (next.userId !== user.uid) return;
          setOrder(next);
          setError(null);
          setMode("live");
          setLoading(false);
          if (TERMINAL_STATUSES.has(next.status)) {
            unsubscribe();
          }
        },
        (snapshotError) => {
          console.warn(
            "Firestore order listener failed, using API polling:",
            snapshotError,
          );
          firestoreAttached.current = false;
          if (active) startPolling();
        },
      );

      return unsubscribe;
    }

    let firestoreUnsub: (() => void) | undefined;

    async function pollOnce() {
      try {
        const next = await fetchOrderFromApi(orderId, accessToken);
        if (!active) return;
        setOrder(next);
        setError(null);
        setMode("polling");
        setLoading(false);

        if (
          !firestoreAttached.current &&
          user?.uid &&
          next.userId === user.uid &&
          configured &&
          isFirebaseClientConfigured()
        ) {
          firestoreUnsub = attachFirestoreListener();
        }

        if (TERMINAL_STATUSES.has(next.status)) {
          stopPolling();
        }
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Order not found.");
        setLoading(false);
      }
    }

    function startPolling() {
      stopPolling();
      setMode("polling");
      pollOnce();
      pollRef.current = setInterval(pollOnce, POLL_MS);
    }

    queueMicrotask(() => {
      if (active) {
        setLoading(true);
        setError(null);
      }
    });

    startPolling();

    return () => {
      active = false;
      firestoreUnsub?.();
      stopPolling();
    };
  }, [orderId, accessToken, configured, user?.uid]);

  return { order, loading, error, mode };
}
