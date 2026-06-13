import { timingSafeEqual } from "crypto";
import type { Order } from "@/types";

export function verifyOrderAccessToken(
  order: Order,
  token?: string | null,
): boolean {
  if (!token || !order.accessToken) return false;
  const a = Buffer.from(order.accessToken);
  const b = Buffer.from(token);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function canAccessOrder(
  order: Order,
  ctx: {
    accessToken?: string | null;
    userId?: string | null;
  },
): boolean {
  if (ctx.userId && order.userId === ctx.userId) return true;
  return verifyOrderAccessToken(order, ctx.accessToken);
}

export function sanitizeOrder(order: Order): Order {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { accessToken, ...rest } = order;
  return rest as Order;
}

export function isInvoiceViewable(order: Order): boolean {
  return order.status === "paid" || order.status === "confirmed";
}
