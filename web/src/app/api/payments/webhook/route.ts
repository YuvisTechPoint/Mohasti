import { NextResponse } from "next/server";
import { getOrder } from "@/lib/orders";
import {
  markOrderPaidFromRazorpay,
} from "@/lib/payments/mark-order-paid";
import { verifyRazorpayWebhookSignature } from "@/lib/razorpay";

type RazorpayWebhookPayload = {
  event?: string;
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
        status?: string;
      };
    };
    order?: {
      entity?: {
        id?: string;
        receipt?: string;
      };
    };
  };
};

export async function POST(request: Request) {
  const signature = request.headers.get("x-razorpay-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const rawBody = await request.text();
  if (!verifyRazorpayWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  let payload: RazorpayWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as RazorpayWebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  if (payload.event !== "payment.captured") {
    return NextResponse.json({ received: true });
  }

  const payment = payload.payload?.payment?.entity;
  const razorpayOrderId =
    payment?.order_id ?? payload.payload?.order?.entity?.id;
  const razorpayPaymentId = payment?.id;
  const receipt = payload.payload?.order?.entity?.receipt;

  if (!razorpayOrderId || !razorpayPaymentId) {
    return NextResponse.json({ error: "Incomplete payment data." }, { status: 400 });
  }

  const orderId = receipt ?? null;
  if (!orderId) {
    return NextResponse.json({ received: true, skipped: "no_receipt" });
  }

  const order = await getOrder(orderId);
  if (!order) {
    return NextResponse.json({ received: true, skipped: "order_not_found" });
  }

  if (order.status === "paid" || order.status === "confirmed") {
    return NextResponse.json({ received: true, alreadyPaid: true });
  }

  await markOrderPaidFromRazorpay(orderId, {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature: signature,
  });

  return NextResponse.json({ received: true });
}
