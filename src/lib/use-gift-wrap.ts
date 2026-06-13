"use client";

import { useCallback, useSyncExternalStore } from "react";

const GIFT_WRAP_KEY = "mohasti-gift-wrap";
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(GIFT_WRAP_KEY) === "true";
}

function getServerSnapshot(): boolean {
  return false;
}

function setStored(value: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(GIFT_WRAP_KEY, value ? "true" : "false");
  listeners.forEach((cb) => cb());
}

export function useGiftWrap() {
  const enabled = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setEnabled = useCallback((value: boolean) => {
    setStored(value);
  }, []);

  const toggle = useCallback(() => {
    setStored(!getSnapshot());
  }, []);

  return { enabled, setEnabled, toggle };
}

export function readGiftWrapPreference(): boolean {
  return getSnapshot();
}

export function clearGiftWrapPreference(): void {
  setStored(false);
}
