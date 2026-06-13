"use client";

import { useCallback, useState } from "react";
import {
  normalizeDiscountCode,
  resolveDiscountCode,
  type DiscountDefinition,
} from "@/lib/discounts";

const STORAGE_KEY = "mohasti-applied-coupon";

type DiscountState = {
  input: string;
  appliedCode?: string;
  appliedDefinition?: DiscountDefinition;
};

function readStoredDiscount(): DiscountState {
  if (typeof window === "undefined") {
    return { input: "" };
  }

  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (!saved) return { input: "" };

    const result = resolveDiscountCode(saved);
    if (result.valid && result.code) {
      return {
        input: result.code,
        appliedCode: result.code,
        appliedDefinition: result.definition,
      };
    }
  } catch {
    // sessionStorage unavailable
  }

  return { input: "" };
}

function persistCoupon(code: string | undefined) {
  if (typeof window === "undefined") return;
  try {
    if (code) {
      sessionStorage.setItem(STORAGE_KEY, code);
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

export function useDiscountCode() {
  const [state, setState] = useState<DiscountState>(readStoredDiscount);
  const [error, setError] = useState("");

  const setInput = useCallback((value: string) => {
    setError("");
    setState((prev) => {
      const nextInput = value;
      const clearedApplied =
        prev.appliedCode &&
        normalizeDiscountCode(nextInput) !== prev.appliedCode;

      if (clearedApplied) {
        persistCoupon(undefined);
        return { input: nextInput };
      }

      return { ...prev, input: nextInput };
    });
  }, []);

  const applyCode = useCallback((raw: string) => {
    const result = resolveDiscountCode(raw);
    if (!result.valid || !result.code) {
      setState({ input: normalizeDiscountCode(raw) });
      setError(result.error ?? "Invalid discount code.");
      persistCoupon(undefined);
      return false;
    }

    setState({
      input: result.code,
      appliedCode: result.code,
      appliedDefinition: result.definition,
    });
    setError("");
    persistCoupon(result.code);
    return true;
  }, []);

  const apply = useCallback(() => applyCode(state.input), [applyCode, state.input]);

  const remove = useCallback(() => {
    setState({ input: "" });
    setError("");
    persistCoupon(undefined);
  }, []);

  return {
    input: state.input,
    appliedCode: state.appliedCode,
    appliedDefinition: state.appliedDefinition,
    error,
    ready: true,
    isApplied: Boolean(state.appliedCode),
    setInput,
    apply,
    applyCode,
    remove,
  };
}
