import crypto from "crypto";
import {
  getPublicKey,
  isRazorpayConfigured,
} from "@/lib/razorpay-config";

export { getPublicKey, isRazorpayConfigured };

export async function getRazorpayInstance() {
  if (!isRazorpayConfigured()) return null;
  const Razorpay = (await import("razorpay")).default;
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
}

export async function createRazorpayOrder(
  amountInr: number,
  receipt: string,
): Promise<{ id: string; amount: number; currency: string } | null> {
  const razorpay = await getRazorpayInstance();
  if (!razorpay) return null;

  const order = await razorpay.orders.create({
    amount: Math.round(amountInr * 100),
    currency: "INR",
    receipt,
    notes: { source: "mohasti-web" },
  });

  return {
    id: order.id,
    amount: Number(order.amount),
    currency: order.currency,
  };
}

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;

  const body = `${orderId}|${paymentId}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  return expected === signature;
}

export function verifyRazorpayWebhookSignature(
  body: string,
  signature: string,
): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  return expected === signature;
}
