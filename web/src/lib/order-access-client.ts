const PREFIX = "mohasti-order-access:";

export function storeOrderAccessToken(orderId: string, token: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(`${PREFIX}${orderId}`, token);
  } catch {
    // ignore
  }
}

export function getOrderAccessToken(orderId: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(`${PREFIX}${orderId}`);
  } catch {
    return null;
  }
}

export function orderApiUrl(orderId: string, token?: string | null): string {
  const base = `/api/orders/${orderId}`;
  if (!token) return base;
  return `${base}?token=${encodeURIComponent(token)}`;
}

export function invoiceUrl(orderId: string, token?: string | null): string {
  const base = `/orders/${orderId}/invoice`;
  if (!token) return base;
  return `${base}?token=${encodeURIComponent(token)}`;
}
