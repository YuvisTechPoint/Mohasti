import { NextResponse } from "next/server";
import { getOrder, updateOrderStatus } from "@/lib/orders";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { getSessionUser } from "@/lib/firebase/session";
import {
  markOrderPaidFromRazorpay,
  orderSuccessUrl,
} from "@/lib/payments/mark-order-paid";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = body;

    if (!orderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { error: "Missing payment details." },
        { status: 400 },
      );
    }

    const order = await getOrder(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const rpOrderId = razorpayOrderId ?? order.payment.razorpayOrderId ?? "";

    if (!rpOrderId) {
      return NextResponse.json(
        { error: "Missing Razorpay order reference." },
        { status: 400 },
      );
    }

    const valid = verifyRazorpaySignature(
      rpOrderId,
      razorpayPaymentId,
      razorpaySignature,
    );

    if (!valid) {
      await updateOrderStatus(orderId, "failed");
      return NextResponse.json(
        { error: "Payment verification failed." },
        { status: 400 },
      );
    }

    const sessionUser = await getSessionUser();
    const { order: updated, alreadyPaid } = await markOrderPaidFromRazorpay(
      orderId,
      {
        razorpayOrderId: rpOrderId,
        razorpayPaymentId,
        razorpaySignature,
      },
      sessionUser?.uid,
    );

    if (!updated) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      alreadyPaid,
      orderId,
      invoiceNumber: updated.invoiceNumber,
      accessToken: order.accessToken,
      redirectUrl: orderSuccessUrl(orderId, order.accessToken),
    });
  } catch (err) {
    console.error("Payment verify error:", err);
    return NextResponse.json(
      { error: "Payment verification failed." },
      { status: 500 },
    );
  }
}
