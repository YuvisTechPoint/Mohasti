"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import type { Order } from "@/types";
import { Button } from "@/components/ui/Button";
import { InvoicePreviewCard } from "@/components/invoice/InvoiceToolbar";
import { formatPrice } from "@/lib/format";
import {
  getOrderAccessToken,
  invoiceUrl,
  storeOrderAccessToken,
} from "@/lib/order-access-client";
import { useRealtimeOrder } from "@/lib/firebase/use-realtime-order";

function OrderSuccessContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.orderId as string;
  const urlToken = searchParams.get("token");
  const [storedToken] = useState(() => getOrderAccessToken(orderId));
  const accessToken = urlToken ?? storedToken;
  const { order, loading, error, mode } = useRealtimeOrder(orderId, accessToken);

  useEffect(() => {
    if (urlToken) storeOrderAccessToken(orderId, urlToken);
  }, [orderId, urlToken]);

  if (loading && !order) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-mohasti-cyan border-t-transparent" />
        <p className="text-sm text-gray-500">Loading order details…</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-display text-2xl text-mohasti-teal">
          {error || "Order not found"}
        </h1>
        <p className="mt-3 text-sm text-gray-600">
          Sign in to your account or use the link from checkout to view this
          order.
        </p>
        <Button href="/account/orders" className="mt-6">
          My Orders
        </Button>
      </div>
    );
  }

  const isCod = order.payment.method === "cod";
  const isSuccess = order.status === "paid" || order.status === "confirmed";

  if (order.status === "pending_payment") {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
        </div>
        <h1 className="font-display text-2xl text-mohasti-teal">
          Confirming payment…
        </h1>
        <p className="mt-3 text-sm text-gray-600">
          Order <strong>{order.id}</strong> — waiting for payment confirmation.
          This page updates automatically.
        </p>
        <LiveBadge mode={mode} />
        <Button href="/checkout" variant="outline" className="mt-6">
          Return to checkout
        </Button>
      </div>
    );
  }

  if (!isSuccess) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-display text-2xl text-red-700">Payment failed</h1>
        <p className="mt-3 text-sm text-gray-600">
          Order {order.id} could not be completed. Please try again.
        </p>
        <Button href="/checkout" className="mt-6">
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:py-24">
      <div className="text-center">
        <LiveBadge mode={mode} className="mb-4" />
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h1 className="font-display text-3xl text-mohasti-teal md:text-4xl">
          Order Confirmed
        </h1>
        <p className="mt-3 text-gray-600">
          Thank you, {order.shipping.fullName}.
          {isCod
            ? ` Pay ${formatPrice(order.totals.grandTotal)} in cash when your order arrives.`
            : " Your payment was successful."}
        </p>
      </div>

      <OrderDetailsCard order={order} isCod={isCod} />

      <InvoicePreviewCard order={order} accessToken={accessToken} />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button href={invoiceUrl(orderId, accessToken)} size="lg">
          View &amp; Download Invoice
        </Button>
        <Button href="/collections/all" variant="outline" size="lg">
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}

function LiveBadge({
  mode,
  className = "",
}: {
  mode: "live" | "polling" | "idle";
  className?: string;
}) {
  if (mode === "idle") return null;

  const label = mode === "live" ? "Live updates" : "Syncing…";
  const dotClass =
    mode === "live" ? "bg-emerald-500 animate-pulse" : "bg-amber-500";

  return (
    <p
      className={`inline-flex items-center gap-2 text-xs text-gray-500 ${className}`}
    >
      <span className={`h-2 w-2 rounded-full ${dotClass}`} aria-hidden />
      {label}
    </p>
  );
}

function OrderDetailsCard({ order, isCod }: { order: Order; isCod: boolean }) {
  return (
    <div className="card-elevated mt-10 p-6 md:p-8">
      <dl className="grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-gray-500">Order ID</dt>
          <dd className="font-semibold text-mohasti-teal-dark">{order.id}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Invoice Number</dt>
          <dd className="font-semibold text-mohasti-teal-dark">
            {order.invoiceNumber}
          </dd>
        </div>
        <div>
          <dt className="text-gray-500">{isCod ? "Amount Due" : "Total Paid"}</dt>
          <dd className="font-semibold text-mohasti-teal-dark">
            {formatPrice(order.totals.grandTotal)}
          </dd>
        </div>
        <div>
          <dt className="text-gray-500">Payment</dt>
          <dd className="font-semibold text-mohasti-teal-dark">
            {isCod ? "Cash on Delivery" : order.payment.razorpayPaymentId ?? "Online"}
          </dd>
        </div>
      </dl>

      <ul className="mt-6 space-y-3 border-t border-gray-100 pt-6">
        {order.items.map((item) => (
          <li key={item.handle} className="flex justify-between text-sm">
            <span>
              {item.title} × {item.quantity}
            </span>
            <span>{formatPrice(item.lineTotal)}</span>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-sm text-gray-600">
        Order details for <strong>{order.shipping.email}</strong>. Estimated
        delivery: 3–7 business days.
      </p>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-mohasti-cyan border-t-transparent" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
