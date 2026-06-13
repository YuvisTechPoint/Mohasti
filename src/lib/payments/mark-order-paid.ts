import { getOrder, linkOrderToUser, updateOrderStatus } from "@/lib/orders";
import type { Order } from "@/types";

export function orderSuccessUrl(orderId: string, accessToken?: string): string {
  const tokenQuery = accessToken ? `?token=${encodeURIComponent(accessToken)}` : "";
  return `/orders/${orderId}/success${tokenQuery}`;
}

export async function markOrderPaidFromRazorpay(
  orderId: string,
  details: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  },
  sessionUserId?: string | null,
): Promise<{ order: Order | null; alreadyPaid: boolean }> {
  const order = await getOrder(orderId);
  if (!order) return { order: null, alreadyPaid: false };

  if (order.status === "paid" || order.status === "confirmed") {
    return { order, alreadyPaid: true };
  }

  const updated = await updateOrderStatus(orderId, "paid", {
    razorpayOrderId: details.razorpayOrderId,
    razorpayPaymentId: details.razorpayPaymentId,
    razorpaySignature: details.razorpaySignature,
    paidAt: new Date().toISOString(),
    method: "razorpay",
  });

  if (sessionUserId && !order.userId) {
    await linkOrderToUser(orderId, sessionUserId);
  }

  return { order: updated, alreadyPaid: false };
}
