"use client";

import Script from "next/script";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { Order } from "@/types";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";
import { getOrderGrandTotal } from "@/lib/order-normalize";
import { storeOrderAccessToken } from "@/lib/order-access-client";

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

export function ResumePaymentClient({
  order,
  accessToken,
  demoMode,
}: {
  order: Order;
  accessToken?: string;
  demoMode: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resumeAndPay = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/orders/${order.id}/resume-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not resume payment.");

      if (data.accessToken) {
        storeOrderAccessToken(order.id, data.accessToken);
      }

      if (data.demoMode) {
        const demoRes = await fetch("/api/payments/demo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: order.id }),
        });
        const demoData = await demoRes.json();
        if (!demoRes.ok) throw new Error(demoData.error ?? "Payment failed.");
        router.push(demoData.redirectUrl);
        return;
      }

      if (!data.razorpay) {
        throw new Error("Payment gateway unavailable.");
      }

      await new Promise<void>((resolve, reject) => {
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
            reject(new Error("Payment gateway failed to load."));
          }
        }, 100);
      });

      const shipping = data.shipping ?? order.shipping;
      const rzp = new window.Razorpay({
        key: data.razorpay.keyId,
        amount: data.razorpay.amount,
        currency: data.razorpay.currency,
        name: "Mohasti",
        description: `Order ${order.id}`,
        order_id: data.razorpay.orderId,
        prefill: {
          name: shipping.fullName,
          email: shipping.email,
          contact: shipping.phone,
        },
        theme: { color: "#1A8A8F" },
        handler: async (response: RazorpayResponse) => {
          setLoading(true);
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: order.id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.error);
            router.push(verifyData.redirectUrl);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Payment failed.");
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });
      rzp.open();
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed.");
      setLoading(false);
    }
  }, [accessToken, order.id, order.shipping, router]);

  return (
    <>
      {!demoMode && (
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      )}
      <div className="card-elevated mx-auto max-w-lg p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#1A8A8F]">
          Complete payment
        </p>
        <h1 className="mt-1 font-display text-2xl text-mohasti-teal-dark">
          {order.invoiceNumber}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Order {order.id} · {order.items.length} item
          {order.items.length !== 1 ? "s" : ""}
        </p>
        <p className="mt-4 text-2xl font-semibold tabular-nums text-[#0f5c60]">
          {formatPrice(getOrderGrandTotal(order))}
        </p>
        {demoMode && (
          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Demo mode — payment will be simulated (no charge).
          </p>
        )}
        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        <Button
          type="button"
          className="mt-6 w-full"
          disabled={loading}
          onClick={resumeAndPay}
        >
          {loading ? "Processing…" : "Pay now"}
        </Button>
      </div>
    </>
  );
}
