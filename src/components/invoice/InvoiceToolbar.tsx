"use client";

import Link from "next/link";
import type { Order } from "@/types";
import { formatPrice } from "@/lib/format";
import { formatInvoiceDate, invoiceStatusBadge } from "@/lib/invoice-utils";
import { invoiceUrl } from "@/lib/order-access-client";

export function InvoiceToolbar({
  order,
  invoiceUrl: shareUrl,
}: {
  order: Order;
  invoiceUrl: string;
}) {
  const status = invoiceStatusBadge(order);
  const mailto = `mailto:${order.shipping.email}?subject=${encodeURIComponent(
    `Mohasti Invoice ${order.invoiceNumber}`,
  )}&body=${encodeURIComponent(
    `Hi ${order.shipping.fullName},\n\nInvoice: ${order.invoiceNumber}\nOrder: ${order.id}\nTotal: ${formatPrice(order.totals.grandTotal)}\n\n${shareUrl}\n\n— Mohasti`,
  )}`;

  return (
    <div className="invoice-toolbar mb-4 flex flex-col gap-4 border-b border-neutral-200 pb-4 print:hidden sm:flex-row sm:items-center sm:justify-between sm:gap-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-[#1A8A8F]">
          {order.invoiceNumber}
        </p>
        <p className="text-xs text-neutral-500">
          {formatInvoiceDate(order.createdAt)} · {status.label} ·{" "}
          {formatPrice(order.totals.grandTotal)}
        </p>
      </div>
      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={() => window.print()}
          className="min-h-11 w-full rounded border border-[#1A8A8F] bg-[#1A8A8F] px-4 py-2.5 text-xs font-medium text-white hover:bg-[#0f5c60] sm:min-h-0 sm:w-auto sm:py-2"
        >
          Print / PDF
        </button>
        <a
          href={mailto}
          className="inline-flex min-h-11 w-full items-center justify-center rounded border border-neutral-300 px-4 py-2.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 sm:min-h-0 sm:w-auto sm:py-2"
        >
          Email
        </a>
        <Link
          href={`/orders/${order.id}/success`}
          className="inline-flex min-h-11 w-full items-center justify-center rounded border border-neutral-300 px-4 py-2.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 sm:min-h-0 sm:w-auto sm:py-2"
        >
          Order
        </Link>
      </div>
    </div>
  );
}

export function InvoicePreviewCard({
  order,
  accessToken,
}: {
  order: Order;
  accessToken?: string | null;
}) {
  const status = invoiceStatusBadge(order);

  return (
    <Link
      href={invoiceUrl(order.id, accessToken)}
      className="group mt-8 block border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-400"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-neutral-500">
            Tax invoice
          </p>
          <p className="mt-0.5 font-medium text-neutral-900">
            {order.invoiceNumber}
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            {formatInvoiceDate(order.createdAt)} · {order.items.length} item
            {order.items.length !== 1 ? "s" : ""} · {status.label}
          </p>
        </div>
        <p className="text-sm font-semibold tabular-nums text-neutral-900">
          {formatPrice(order.totals.grandTotal)}
        </p>
      </div>
      <p className="mt-3 text-xs text-neutral-500 group-hover:text-neutral-800">
        View invoice →
      </p>
    </Link>
  );
}
