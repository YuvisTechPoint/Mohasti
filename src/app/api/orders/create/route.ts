import { NextResponse } from "next/server";
import type { CartItem, ShippingAddress } from "@/types";
import { createOrder } from "@/lib/orders";
import { validateCartItems } from "@/lib/pricing";
import { resolveDiscountCode } from "@/lib/discounts";
import { getSessionUser } from "@/lib/firebase/session";
import {
  createRazorpayOrder,
  getPublicKey,
  isRazorpayConfigured,
} from "@/lib/razorpay";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, shipping, discountCode, giftWrap, paymentMethod } = body as {
      items: CartItem[];
      shipping: ShippingAddress;
      discountCode?: string;
      giftWrap?: boolean;
      paymentMethod?: "online" | "cod";
    };

    if (!items?.length || !shipping?.email || !shipping?.fullName) {
      return NextResponse.json(
        { error: "Invalid checkout data." },
        { status: 400 },
      );
    }

    const { valid, errors } = validateCartItems(items);
    if (errors.length || !valid.length) {
      return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
    }

    let validatedDiscountCode: string | undefined;
    if (discountCode?.trim()) {
      const resolved = resolveDiscountCode(discountCode);
      if (!resolved.valid) {
        return NextResponse.json(
          { error: resolved.error ?? "Invalid discount code." },
          { status: 400 },
        );
      }
      validatedDiscountCode = resolved.code;
    }

    const sessionUser = await getSessionUser();
    const checkoutPaymentMethod =
      paymentMethod === "cod" ? "cod" : "online";
    const order = await createOrder(
      valid,
      shipping,
      validatedDiscountCode,
      sessionUser?.uid,
      Boolean(giftWrap),
      checkoutPaymentMethod,
    );

    if (checkoutPaymentMethod === "cod") {
      return NextResponse.json({
        orderId: order.id,
        accessToken: order.accessToken,
        invoiceNumber: order.invoiceNumber,
        totals: order.totals,
        cod: true,
        razorpay: null,
        demoMode: !isRazorpayConfigured(),
      });
    }

    let razorpayOrder = null;
    if (isRazorpayConfigured()) {
      try {
        razorpayOrder = await createRazorpayOrder(
          order.totals.grandTotal,
          order.id,
        );
      } catch (razorpayErr) {
        console.error("Razorpay order create error:", razorpayErr);
        return NextResponse.json(
          { error: "Payment gateway error. Please try again." },
          { status: 502 },
        );
      }

      if (razorpayOrder) {
        order.payment.razorpayOrderId = razorpayOrder.id;
        const { saveOrder } = await import("@/lib/orders");
        await saveOrder(order);
      }
    }

    return NextResponse.json({
      orderId: order.id,
      accessToken: order.accessToken,
      invoiceNumber: order.invoiceNumber,
      totals: order.totals,
      razorpay: razorpayOrder
        ? {
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            keyId: getPublicKey(),
          }
        : null,
      demoMode: !isRazorpayConfigured(),
    });
  } catch (err) {
    console.error("Order create error:", err);
    const detail =
      process.env.NODE_ENV === "development" && err instanceof Error
        ? err.message
        : "Failed to create order.";
    return NextResponse.json({ error: detail }, { status: 500 });
  }
}
