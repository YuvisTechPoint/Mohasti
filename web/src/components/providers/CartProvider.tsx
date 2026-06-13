"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import type { CartItem, Product } from "@/types";
import {
  getCartSnapshot,
  getServerCartSnapshot,
  subscribeCart,
  writeCart,
} from "@/lib/cart-store";

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  isHydrated: boolean;
  itemCount: number;
  subtotal: number;
  addItem: (product: Product, quantity?: number) => void;
  buyNow: (product: Product, quantity?: number) => void;
  removeItem: (handle: string) => void;
  updateQuantity: (handle: string, quantity: number) => void;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function buildCartItem(product: Product, quantity: number): CartItem {
  return {
    handle: product.handle,
    title: product.title,
    price: product.price,
    quantity,
    imageGradient: product.imageGradient,
    ...(product.image ? { image: product.image } : {}),
  };
}

function mergeItem(
  prev: CartItem[],
  product: Product,
  quantity: number,
): CartItem[] {
  const existing = prev.find((i) => i.handle === product.handle);
  if (existing) {
    return prev.map((i) =>
      i.handle === product.handle
        ? { ...i, quantity: i.quantity + quantity }
        : i,
    );
  }
  return [...prev, buildCartItem(product, quantity)];
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(
    subscribeCart,
    getCartSnapshot,
    getServerCartSnapshot,
  );

  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((product: Product, quantity = 1) => {
    if (product.status === "sold_out") return;
    writeCart(mergeItem(getCartSnapshot(), product, quantity));
    setIsOpen(true);
  }, []);

  const buyNow = useCallback((product: Product, quantity = 1) => {
    if (product.status === "sold_out") return;
    writeCart(mergeItem([], product, quantity));
    setIsOpen(false);
  }, []);

  const removeItem = useCallback((handle: string) => {
    writeCart(getCartSnapshot().filter((i) => i.handle !== handle));
  }, []);

  const updateQuantity = useCallback((handle: string, quantity: number) => {
    const prev = getCartSnapshot();
    const next =
      quantity < 1
        ? prev.filter((i) => i.handle !== handle)
        : prev.map((i) => (i.handle === handle ? { ...i, quantity } : i));
    writeCart(next);
  }, []);

  const clearCart = useCallback(() => writeCart([]), []);

  const value = useMemo(
    () => ({
      items,
      isOpen,
      isHydrated,
      itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      addItem,
      buyNow,
      removeItem,
      updateQuantity,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      clearCart,
    }),
    [
      items,
      isOpen,
      isHydrated,
      addItem,
      buyNow,
      removeItem,
      updateQuantity,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
