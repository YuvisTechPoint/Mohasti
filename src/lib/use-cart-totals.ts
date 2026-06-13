"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { CartItem, OrderTotals } from "@/types";
import { calculateTotals, validateCartItems } from "@/lib/pricing";

export function useCartTotals(
  items: CartItem[],
  discountCode?: string,
  customerState = "Maharashtra",
  giftWrap = false,
): OrderTotals | null {
  return useMemo(() => {
    const { valid } = validateCartItems(items);
    if (!valid.length) return null;
    return calculateTotals(valid, discountCode, customerState, giftWrap);
  }, [items, discountCode, customerState, giftWrap]);
}

export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
