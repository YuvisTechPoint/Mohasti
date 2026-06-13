"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { CartItem, ShippingAddress } from "@/types";
import { storeOrderAccessToken } from "@/lib/order-access-client";
import { readGiftWrapPreference, clearGiftWrapPreference } from "@/lib/use-gift-wrap";

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export function useCheckoutPayment({
  items,
  shipping,
  discountCode,
  paymentMethod = "online",
  onClearCart,
}: {
  items: CartItem[];
  shipping: ShippingAddress;
  discountCode?: string;
  paymentMethod?: "online" | "cod";
  onClearCart: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createOrder = useCallback(async () => {
    const res = await fetch("/api/orders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items,
        shipping,
        discountCode,
        giftWrap: readGiftWrapPreference(),
        paymentMethod,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Order failed.");
    return data as {
      orderId: string;
      accessToken?: string;
      demoMode: boolean;
      cod?: boolean;
      razorpay: {
        orderId: string;
        amount: number;
        currency: string;
        keyId: string;
      } | null;
    };
  }, [items, shipping, discountCode, paymentMethod]);

  const completeCodOrder = useCallback(
    (orderId: string, accessToken?: string) => {
      clearGiftWrapPreference();
      onClearCart();
      const tokenQuery = accessToken
        ? `?token=${encodeURIComponent(accessToken)}`
        : "";
      router.push(`/orders/${orderId}/success${tokenQuery}`);
    },
    [onClearCart, router],
  );

  const completeDemoPayment = useCallback(
    async (orderId: string) => {
      const res = await fetch("/api/payments/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Payment failed.");
      clearGiftWrapPreference();
      onClearCart();
      router.push(data.redirectUrl);
    },
    [onClearCart, router],
  );

  const openRazorpay = useCallback(
    (
      orderId: string,
      razorpay: NonNullable<Awaited<ReturnType<typeof createOrder>>["razorpay"]>,
    ) => {
      const options = {
        key: razorpay.keyId,
        amount: razorpay.amount,
        currency: razorpay.currency,
        name: "Mohasti",
        description: `Order ${orderId}`,
        order_id: razorpay.orderId,
        prefill: {
          name: shipping.fullName,
          email: shipping.email,
          contact: shipping.phone,
        },
        theme: { color: "#1A8A8F" },
        notes: {
          currency: "INR",
        },
        handler: async (response: RazorpayResponse) => {
          setLoading(true);
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.error);
            clearGiftWrapPreference();
            onClearCart();
            router.push(verifyData.redirectUrl);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Payment failed.");
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    },
    [onClearCart, router, shipping],
  );

  const waitForRazorpay = (): Promise<void> =>
    new Promise((resolve, reject) => {
      if (typeof window.Razorpay !== "undefined") {
        resolve();
        return;
      }
      let attempts = 0;
      const interval = setInterval(() => {
        attempts += 1;
        if (typeof window.Razorpay !== "undefined") {
          clearInterval(interval);
          resolve();
        } else if (attempts > 50) {
          clearInterval(interval);
          reject(
            new Error(
              "Payment gateway failed to load. Please refresh and try again.",
            ),
          );
        }
      }, 100);
    });

  const pay = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const orderData = await createOrder();
      if (orderData.accessToken) {
        storeOrderAccessToken(orderData.orderId, orderData.accessToken);
      }

      if (orderData.cod || paymentMethod === "cod") {
        completeCodOrder(orderData.orderId, orderData.accessToken);
        return;
      }

      if (orderData.demoMode) {
        await completeDemoPayment(orderData.orderId);
        return;
      }

      if (orderData.razorpay) {
        await waitForRazorpay();
        openRazorpay(orderData.orderId, orderData.razorpay);
      } else {
        throw new Error("Payment gateway unavailable.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed.");
      setLoading(false);
    }
  }, [completeCodOrder, completeDemoPayment, createOrder, openRazorpay, paymentMethod]);

  return { pay, loading, error, setError };
}
