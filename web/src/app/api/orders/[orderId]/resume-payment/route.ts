import { NextResponse } from "next/server";
import { getOrder, saveOrder } from "@/lib/orders";
import { canAccessOrder } from "@/lib/order-access";
import { getSessionUser } from "@/lib/firebase/session";
import {
  createRazorpayOrder,
  getPublicKey,
  isRazorpayConfigured,
} from "@/lib/razorpay";
import { isDemoPaymentsAllowed } from "@/lib/env";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    const { orderId } = await params;
    const body = await request.json().catch(() => ({}));
    const accessToken =
      typeof body.accessToken === "string" ? body.accessToken : undefined;

    const order = await getOrder(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const sessionUser = await getSessionUser();
    if (
      !canAccessOrder(order, {
        accessToken,
        userId: sessionUser?.uid,
      })
    ) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    if (order.status === "paid" || order.status === "confirmed") {
      return NextResponse.json(
        { error: "This order is already complete." },
        { status: 400 },
      );
    }

    if (order.status !== "pending_payment") {
      return NextResponse.json(
        { error: "Payment cannot be resumed for this order." },
        { status: 400 },
      );
    }

    if (order.payment.method === "cod") {
      return NextResponse.json(
        { error: "This is a cash-on-delivery order." },
        { status: 400 },
      );
    }

    if (!isRazorpayConfigured()) {
      if (!isDemoPaymentsAllowed()) {
        return NextResponse.json(
          { error: "Payment gateway unavailable." },
          { status: 503 },
        );
      }

      return NextResponse.json({
        orderId: order.id,
        accessToken: order.accessToken,
        demoMode: true,
        razorpay: null,
      });
    }

    const razorpayOrder = await createRazorpayOrder(
      order.totals.grandTotal,
      order.id,
    );

    if (!razorpayOrder) {
      return NextResponse.json(
        { error: "Payment gateway error. Please try again." },
        { status: 502 },
      );
    }

    order.payment.razorpayOrderId = razorpayOrder.id;
    order.updatedAt = new Date().toISOString();
    await saveOrder(order);

    return NextResponse.json({
      orderId: order.id,
      accessToken: order.accessToken,
      demoMode: false,
      razorpay: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: getPublicKey(),
      },
      shipping: {
        fullName: order.shipping.fullName,
        email: order.shipping.email,
        phone: order.shipping.phone,
      },
    });
  } catch (err) {
    console.error("Resume payment error:", err);
    return NextResponse.json(
      { error: "Failed to resume payment." },
      { status: 500 },
    );
  }
}
