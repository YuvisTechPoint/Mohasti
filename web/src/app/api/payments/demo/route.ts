import { NextResponse } from "next/server";
import { getOrder, linkOrderToUser, updateOrderStatus } from "@/lib/orders";
import { getSessionUser } from "@/lib/firebase/session";
import { isDemoPaymentsAllowed } from "@/lib/env";
import { orderSuccessUrl } from "@/lib/payments/mark-order-paid";
import { isRazorpayConfigured } from "@/lib/razorpay";

export async function POST(request: Request) {
  if (!isDemoPaymentsAllowed() || isRazorpayConfigured()) {
    return NextResponse.json(
      { error: "Demo payments are not available." },
      { status: 403 },
    );
  }

  try {
    const { orderId } = await request.json();
    if (!orderId) {
      return NextResponse.json({ error: "Order ID required." }, { status: 400 });
    }

    const order = await getOrder(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const updated = await updateOrderStatus(orderId, "paid", {
      method: "demo",
      razorpayPaymentId: `demo_${Date.now()}`,
      paidAt: new Date().toISOString(),
    });

    const sessionUser = await getSessionUser();
    if (sessionUser && !order.userId) {
      await linkOrderToUser(orderId, sessionUser.uid);
    }

    return NextResponse.json({
      success: true,
      orderId,
      invoiceNumber: updated?.invoiceNumber,
      accessToken: order.accessToken,
      redirectUrl: orderSuccessUrl(orderId, order.accessToken),
    });
  } catch (err) {
    console.error("Demo payment error:", err);
    return NextResponse.json(
      { error: "Demo payment failed." },
      { status: 500 },
    );
  }
}
