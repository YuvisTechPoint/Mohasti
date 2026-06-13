import type { ReactNode } from "react";
import type { Order } from "@/types";
import { formatPrice } from "@/lib/format";
import {
  INVOICE_SELLER,
  amountInWordsInr,
  formatInvoiceDate,
  formatInvoiceDateTime,
  gstSupplyType,
  invoicePaymentDateLabel,
  invoiceStatusBadge,
  paymentMethodLabel,
} from "@/lib/invoice-utils";

export function InvoiceDocument({ order }: { order: Order }) {
  const isIntraState = order.totals.igst === 0;
  const status = invoiceStatusBadge(order);

  return (
    <article className="invoice-print mx-auto max-w-[210mm] overflow-x-hidden bg-white text-[12px] leading-relaxed text-neutral-800 sm:text-[13px] print:max-w-none">
      <div className="invoice-accent-bar h-1 bg-[#1A8A8F]" aria-hidden />

      {/* Header */}
      <header className="border-b border-neutral-200 px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <p className="font-display text-lg font-semibold tracking-tight text-[#1A8A8F] sm:text-xl">
              {INVOICE_SELLER.name}
            </p>
            <p className="text-xs text-neutral-500">{INVOICE_SELLER.tagline}</p>
            <p className="mt-2 space-y-0.5 text-xs text-neutral-600 sm:space-y-0">
              <span className="block break-all text-[#0f5c60] sm:inline">
                {INVOICE_SELLER.email}
              </span>
              <span className="hidden sm:inline"> · </span>
              <span className="block sm:inline">{INVOICE_SELLER.phone}</span>
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1A8A8F]">
              Tax Invoice
            </p>
            <StatusPill tone={status.tone} label={status.label} />
            <p className="mt-1.5 text-xs text-neutral-500">
              {gstSupplyType(isIntraState)}
            </p>
          </div>
        </div>
      </header>

      {/* Meta */}
      <section className="grid grid-cols-2 border-b border-neutral-200 bg-[#fafcfc] sm:grid-cols-4">
        <Meta label="Invoice No." value={order.invoiceNumber} highlight />
        <Meta label="Order ID" value={order.id} mono highlight />
        <Meta label="Invoice Date" value={formatInvoiceDate(order.createdAt)} />
        <Meta
          label="Payment"
          value={invoicePaymentDateLabel(order)}
          highlight={!order.payment.paidAt}
        />
      </section>

      <div className="invoice-print-sheet px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6">
        {/* Parties */}
        <section className="grid gap-5 border-b border-neutral-200 pb-5 sm:gap-6 sm:pb-6 md:grid-cols-2 md:gap-8">
          <Party title="Sold by">
            <p className="font-medium text-[#0f5c60]">{INVOICE_SELLER.legalName}</p>
            <p className="mt-1 text-neutral-600">{INVOICE_SELLER.address}</p>
            <dl className="mt-3 space-y-1 text-xs">
              <Row label="GSTIN" value={INVOICE_SELLER.gstin} />
              <Row label="PAN" value={INVOICE_SELLER.pan} />
              <Row
                label="State"
                value={`${INVOICE_SELLER.state} (${INVOICE_SELLER.stateCode})`}
              />
            </dl>
          </Party>

          <Party title="Bill to & Ship to">
            <p className="font-medium text-[#0f5c60]">{order.shipping.fullName}</p>
            <p className="mt-1 text-neutral-600">
              {order.shipping.addressLine1}
              {order.shipping.addressLine2 && `, ${order.shipping.addressLine2}`}
              <br />
              {order.shipping.city}, {order.shipping.state} {order.shipping.pincode}
              <br />
              {order.shipping.country}
            </p>
            <dl className="mt-3 space-y-1 text-xs">
              <Row label="Email" value={order.shipping.email} />
              <Row label="Phone" value={order.shipping.phone} />
              {order.shipping.gstin && (
                <Row label="GSTIN" value={order.shipping.gstin} />
              )}
              <Row label="Place of supply" value={order.shipping.state} highlight />
            </dl>
          </Party>
        </section>

        {/* Items */}
        <section className="invoice-items-area mt-5 sm:mt-6">
          <div className="invoice-mobile-items space-y-3 sm:hidden print:hidden">
            {order.items.map((item, i) => (
              <div
                key={item.handle}
                className="rounded-lg border border-neutral-200 bg-neutral-50/80 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium text-neutral-500">#{i + 1}</p>
                    <p className="font-medium text-neutral-900">{item.title}</p>
                  </div>
                  <p className="shrink-0 font-semibold tabular-nums text-[#1A8A8F]">
                    {formatPrice(item.lineTotal)}
                  </p>
                </div>
                <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
                  <div>
                    <dt className="text-neutral-500">HSN</dt>
                    <dd className="text-neutral-800">{item.hsnCode}</dd>
                  </div>
                  <div>
                    <dt className="text-neutral-500">Qty</dt>
                    <dd className="text-neutral-800">{item.quantity}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-neutral-500">Rate</dt>
                    <dd className="text-neutral-800">{formatPrice(item.unitPrice)}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>

          <div className="invoice-table-scroll hidden sm:block print:block">
            <table className="invoice-table w-full min-w-[32rem] border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-[#1A8A8F] text-left text-[#0f5c60]">
                <th className="py-2 pr-3 font-medium">#</th>
                <th className="py-2 pr-3 font-medium">Description</th>
                <th className="hidden py-2 pr-3 font-medium sm:table-cell">HSN</th>
                <th className="py-2 pr-3 text-right font-medium">Qty</th>
                <th className="py-2 pr-3 text-right font-medium">Rate</th>
                <th className="py-2 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={item.handle} className="border-b border-neutral-200">
                  <td className="py-2.5 pr-3 text-neutral-500">{i + 1}</td>
                  <td className="py-2.5 pr-3 font-medium text-neutral-900">
                    {item.title}
                  </td>
                  <td className="hidden py-2.5 pr-3 text-neutral-600 sm:table-cell">
                    {item.hsnCode}
                  </td>
                  <td className="py-2.5 pr-3 text-right tabular-nums">{item.quantity}</td>
                  <td className="py-2.5 pr-3 text-right tabular-nums">
                    {formatPrice(item.unitPrice)}
                  </td>
                  <td className="py-2.5 text-right tabular-nums font-semibold text-[#1A8A8F]">
                    {formatPrice(item.lineTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </section>

        {/* Totals + footer — kept together for print */}
        <div className="invoice-print-bottom mt-5 sm:mt-6">
        <section className="invoice-totals-block grid gap-6 sm:gap-8 md:grid-cols-2">
          <div className="text-xs">
            <p className="font-semibold uppercase tracking-wide text-[#1A8A8F]">
              Amount in words
            </p>
            <p className="invoice-highlight-box mt-1 rounded px-2.5 py-2 text-neutral-800">
              {amountInWordsInr(order.totals.grandTotal)}
            </p>

            <p className="mt-5 font-semibold uppercase tracking-wide text-[#1A8A8F]">
              Payment
            </p>
            <dl className="mt-1 space-y-1">
              <Row label="Method" value={paymentMethodLabel(order.payment.method)} />
              {order.payment.method === "cod" ? (
                <Row label="Note" value="Payable on delivery" />
              ) : (
                <Row
                  label="Transaction"
                  value={order.payment.razorpayPaymentId ?? "—"}
                  mono
                />
              )}
              {order.payment.paidAt && (
                <Row
                  label="Paid at"
                  value={formatInvoiceDateTime(order.payment.paidAt)}
                />
              )}
            </dl>
          </div>

          <div className="sm:text-right">
            <dl className="space-y-1 text-xs sm:ml-auto sm:max-w-xs">
              <TotalRow label="Subtotal" value={formatPrice(order.totals.subtotal)} />
              {order.totals.discount > 0 && (
                <TotalRow
                  label={`Discount (${order.totals.discountCode})`}
                  value={`− ${formatPrice(order.totals.discount)}`}
                  accent="discount"
                />
              )}
              <TotalRow
                label="Shipping"
                value={
                  order.totals.shipping === 0
                    ? "Free"
                    : formatPrice(order.totals.shipping)
                }
              />
              {(order.totals.giftWrap ?? 0) > 0 && (
                <TotalRow
                  label="Gift wrap"
                  value={formatPrice(order.totals.giftWrap!)}
                />
              )}
              <TotalRow
                label="Taxable value"
                value={formatPrice(order.totals.taxableAmount)}
              />
              {isIntraState ? (
                <>
                  <TotalRow label="CGST @ 6%" value={formatPrice(order.totals.cgst)} />
                  <TotalRow label="SGST @ 6%" value={formatPrice(order.totals.sgst)} />
                </>
              ) : (
                <TotalRow label="IGST @ 12%" value={formatPrice(order.totals.igst)} />
              )}
            </dl>
            <div className="invoice-total-bar mt-3 sm:ml-auto sm:max-w-xs">
              <div className="flex items-baseline justify-between gap-4 rounded px-3 py-2.5">
                <span className="text-sm font-semibold text-[#0f5c60]">Total</span>
                <span className="text-base font-bold tabular-nums text-[#1A8A8F]">
                  {formatPrice(order.totals.grandTotal)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="invoice-print-footer mt-5 border-t border-neutral-200 pt-4 text-center text-[10px] leading-relaxed text-neutral-500 sm:mt-6 sm:text-left sm:text-[11px]">
          <p className="break-words">
            Computer-generated invoice · No signature required · Subject to Mumbai
            jurisdiction ·{" "}
            <span className="text-[#1A8A8F]">{INVOICE_SELLER.email}</span>
          </p>
        </footer>
        </div>
      </div>
    </article>
  );
}

function StatusPill({
  tone,
  label,
}: {
  tone: "paid" | "cod" | "pending";
  label: string;
}) {
  const styles =
    tone === "paid"
      ? "bg-emerald-100 text-emerald-800"
      : tone === "cod"
        ? "bg-[#FFDE59] text-[#0f5c60]"
        : "bg-amber-100 text-amber-800";

  return (
    <span
      className={`mt-1.5 inline-block rounded px-2.5 py-0.5 text-[11px] font-bold tracking-wider ${styles}`}
    >
      {label}
    </span>
  );
}

function Meta({
  label,
  value,
  mono,
  highlight,
}: {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="border-b border-neutral-200 px-3 py-2.5 sm:border-b-0 sm:border-r sm:px-4 sm:py-3 sm:last:border-r-0 md:px-5">
      <p className="text-[10px] font-medium uppercase tracking-wide text-[#1A8A8F]">
        {label}
      </p>
      <p
        className={`mt-0.5 break-words text-xs sm:text-sm ${mono ? "font-mono text-[10px] sm:text-xs" : ""} ${
          highlight ? "font-semibold text-[#0f5c60]" : "text-neutral-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Party({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[#1A8A8F]">
        {title}
      </p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
  highlight,
}: {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
      <dt className="shrink-0 text-neutral-500">{label}</dt>
      <dd
        className={`min-w-0 break-words text-left sm:text-right ${mono ? "font-mono text-[10px]" : ""} ${
          highlight ? "font-medium text-[#1A8A8F]" : "text-neutral-800"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

function TotalRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "discount";
}) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-neutral-600">{label}</dt>
      <dd
        className={`tabular-nums ${
          accent === "discount" ? "font-medium text-emerald-700" : "text-neutral-900"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
