import type { ShippingAddress } from "@/types";

const ADDRESS_KEY = "mohasti-shipping-address";
const STATE_KEY = "mohasti-shipping-state";
const DEFAULT_STATE = "Maharashtra";

export const emptyShippingAddress: ShippingAddress = {
  fullName: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: DEFAULT_STATE,
  pincode: "",
  country: "India",
  gstin: "",
};

export function getPreferredShippingState(): string {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    return localStorage.getItem(STATE_KEY) ?? DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
}

export function getSavedShipping(): ShippingAddress {
  if (typeof window === "undefined") return { ...emptyShippingAddress };

  try {
    const raw = localStorage.getItem(ADDRESS_KEY);
    if (!raw) {
      return {
        ...emptyShippingAddress,
        state: getPreferredShippingState(),
      };
    }
    return { ...emptyShippingAddress, ...JSON.parse(raw) } as ShippingAddress;
  } catch {
    return { ...emptyShippingAddress, state: getPreferredShippingState() };
  }
}

export function saveShipping(address: ShippingAddress): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ADDRESS_KEY, JSON.stringify(address));
    if (address.state) {
      localStorage.setItem(STATE_KEY, address.state);
    }
  } catch {
    // ignore
  }
}

export function setPreferredShippingState(state: string): void {
  if (typeof window === "undefined" || !state.trim()) return;
  try {
    localStorage.setItem(STATE_KEY, state);
  } catch {
    // ignore
  }
}

export function isShippingComplete(
  shipping: ShippingAddress,
  fallback?: { email?: string | null; fullName?: string | null },
): boolean {
  const email = shipping.email || fallback?.email || "";
  const fullName = shipping.fullName || fallback?.fullName || "";

  return Boolean(
    fullName.trim() &&
      email.trim() &&
      shipping.phone.trim() &&
      shipping.addressLine1.trim() &&
      shipping.city.trim() &&
      shipping.pincode.trim() &&
      shipping.state.trim(),
  );
}

export function withAuthShipping(
  shipping: ShippingAddress,
  user?: { email?: string | null; displayName?: string | null } | null,
): ShippingAddress {
  return {
    ...shipping,
    email: shipping.email || user?.email || "",
    fullName: shipping.fullName || user?.displayName || "",
  };
}
