import type { CartItem } from "@/types";

export const CART_STORAGE_KEY = "mohasti-cart";

const listeners = new Set<() => void>();
let cachedRaw = "";
let cachedItems: CartItem[] = [];

function readRaw(): string {
  if (typeof window === "undefined") return "[]";
  return localStorage.getItem(CART_STORAGE_KEY) ?? "[]";
}

export function getCartSnapshot(): CartItem[] {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedItems = JSON.parse(raw) as CartItem[];
    } catch {
      cachedItems = [];
    }
  }
  return cachedItems;
}

const EMPTY_CART: CartItem[] = [];

export function getServerCartSnapshot(): CartItem[] {
  return EMPTY_CART;
}

export function subscribeCart(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);

  const onStorage = (event: StorageEvent) => {
    if (event.key === CART_STORAGE_KEY) {
      cachedRaw = "";
      onStoreChange();
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }

  return () => {
    listeners.delete(onStoreChange);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

export function writeCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  cachedRaw = "";
  listeners.forEach((listener) => listener());
}

export function invalidateCartCache(): void {
  cachedRaw = "";
}
