"use client";

import { useMemo } from "react";
import type { ReactNode } from "react";
import type { CartItem } from "@/types";
import { formatPrice } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD, GIFT_WRAP_FEE } from "@/lib/pricing";
import { useCartTotals } from "@/lib/use-cart-totals";
import { useGiftWrap } from "@/lib/use-gift-wrap";
import type { useDiscountCode } from "@/lib/use-discount-code";
import { SwipeToPay } from "@/components/checkout/SwipeToPay";
import { CartItemThumb } from "@/components/product/CartItemThumb";

type DiscountState = ReturnType<typeof useDiscountCode>;

export function OrderSummaryPanel({
  items,
  customerState,
  discount,
  showCouponHints = true,
  swipeToPay,
  swipeLabel,
  paymentNote = "Secure checkout in INR (₹) · UPI · Cards · Net Banking · COD",
}: {
  items: CartItem[];
  customerState: string;
  discount: DiscountState;
  showCouponHints?: boolean;
  swipeToPay?: {
    onSwipe: () => void;
    loading?: boolean;
    disabled?: boolean;
  };
  swipeLabel?: string;
  paymentNote?: string;
}) {
  const { enabled: giftWrap, setEnabled: setGiftWrap } = useGiftWrap();
  const totals = useCartTotals(
    items,
    discount.appliedCode,
    customerState,
    giftWrap,
  );

  const itemKey = useMemo(
    () => items.map((i) => `${i.handle}:${i.quantity}`).join("|"),
    [items],
  );

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const afterDiscountSubtotal = totals
    ? totals.subtotal - totals.discount
    : 0;
  const freeShippingRemaining = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - afterDiscountSubtotal,
  );

  const handleApply = (e?: React.FormEvent) => {
    e?.preventDefault();
    discount.apply();
  };

  return (
    <div className="card-elevated overflow-hidden lg:sticky lg:top-24">
      <div className="border-b border-gray-100 bg-gradient-to-r from-mohasti-teal/5 to-mohasti-cyan/5 px-6 py-4 md:px-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-mohasti-teal">
            Order Summary
          </h2>
          <span className="rounded-full bg-mohasti-teal/10 px-3 py-1 text-xs font-semibold text-mohasti-teal">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-6 md:p-8">
        <ul
          key={itemKey}
          className="max-h-52 space-y-3 overflow-y-auto text-sm"
        >
          {items.map((item) => (
            <li key={item.handle} className="flex gap-3">
              <CartItemThumb
                title={item.title}
                image={item.image}
                imageGradient={item.imageGradient}
                className="h-14 w-14 rounded-xl ring-1 ring-gray-200"
              />
              <div className="flex min-w-0 flex-1 justify-between gap-3">
                <div className="min-w-0">
                  <p className="line-clamp-2 font-medium text-mohasti-teal-dark">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Qty {item.quantity}
                  </p>
                </div>
                <span className="shrink-0 font-semibold tabular-nums text-mohasti-teal-dark">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            </li>
          ))}
        </ul>

        {freeShippingRemaining > 0 && totals && (
          <div className="mt-5 rounded-xl bg-mohasti-cyan/8 px-4 py-3">
            <p className="text-xs text-mohasti-teal-dark">
              Add{" "}
              <strong>{formatPrice(freeShippingRemaining)}</strong> more for{" "}
              <strong>free shipping</strong>
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-mohasti-cyan to-mohasti-teal transition-all"
                style={{
                  width: `${Math.min(100, (afterDiscountSubtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        <div className="mt-5">
          {discount.isApplied && discount.appliedDefinition ? (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                  <TagIcon />
                  {discount.appliedCode} applied
                </p>
                <p className="text-xs text-emerald-700">
                  {discount.appliedDefinition.description} ·{" "}
                  {discount.appliedDefinition.label}
                </p>
              </div>
              <button
                type="button"
                onClick={discount.remove}
                className="shrink-0 rounded-lg px-2 py-1 text-xs font-medium text-emerald-800 underline hover:text-emerald-950"
              >
                Remove
              </button>
            </div>
          ) : (
            <form onSubmit={handleApply} className="space-y-2">
              <label
                htmlFor="discount-code"
                className="text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                Promo code
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <TagIcon />
                  </span>
                  <input
                    id="discount-code"
                    aria-label="Discount code"
                    value={discount.input}
                    onChange={(e) => discount.setInput(e.target.value)}
                    placeholder="e.g. NEWSLETTER10"
                    autoComplete="off"
                    spellCheck={false}
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm uppercase tracking-wide outline-none transition-colors placeholder:normal-case placeholder:tracking-normal focus:border-mohasti-cyan focus:ring-2 focus:ring-mohasti-lotus-glow/40"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!discount.input.trim()}
                  className="shrink-0 rounded-xl border-2 border-mohasti-gold bg-mohasti-yellow/30 px-4 py-2.5 text-sm font-semibold text-mohasti-teal-dark transition-colors hover:bg-mohasti-yellow disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Apply
                </button>
              </div>
              {discount.error && (
                <p className="text-xs text-red-600" role="alert">
                  {discount.error}
                </p>
              )}
              {showCouponHints && !discount.error && (
                <p className="text-xs text-gray-500">
                  Try{" "}
                  <button
                    type="button"
                    onClick={() => discount.applyCode("NEWSLETTER10")}
                    className="font-semibold text-mohasti-teal underline hover:text-mohasti-cyan"
                  >
                    NEWSLETTER10
                  </button>{" "}
                  for 10% off
                </p>
              )}
            </form>
          )}
        </div>

        {totals && (
          <div className="mt-6 space-y-2.5 border-t border-gray-100 pt-6 text-sm">
            <Row label="Subtotal" value={formatPrice(totals.subtotal)} />
            {totals.discount > 0 && (
              <Row
                label={`Discount (${totals.discountCode})`}
                value={`− ${formatPrice(totals.discount)}`}
                className="text-emerald-700"
                valueClassName="font-semibold"
              />
            )}
            <Row
              label="Shipping"
              value={
                totals.shipping === 0 ? (
                  <span className="font-medium text-emerald-700">Free</span>
                ) : (
                  formatPrice(totals.shipping)
                )
              }
            />
            <Row
              label="GST (12% incl.)"
              value={formatPrice(totals.gstTotal)}
            />
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3 transition-colors hover:bg-gray-50">
              <input
                type="checkbox"
                checked={giftWrap}
                onChange={(e) => setGiftWrap(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-mohasti-teal focus:ring-mohasti-cyan/40"
              />
              <span className="min-w-0">
                <span className="block text-sm font-medium text-mohasti-teal-dark">
                  Gift wrap
                </span>
                <span className="mt-0.5 block text-xs text-gray-500">
                  Mohasti packaging for gifting · extra {formatPrice(GIFT_WRAP_FEE)}
                </span>
              </span>
            </label>
            {totals.giftWrap > 0 && (
              <Row label="Gift wrap" value={formatPrice(totals.giftWrap)} />
            )}
            {totals.discount > 0 && (
              <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
                You save {formatPrice(totals.discount)} on this order
              </p>
            )}
            {swipeToPay && totals ? (
              <SwipeToPay
                amount={totals.grandTotal}
                onComplete={swipeToPay.onSwipe}
                loading={swipeToPay.loading}
                disabled={swipeToPay.disabled}
                label={swipeLabel}
              />
            ) : (
              <div className="flex items-center justify-between rounded-xl bg-mohasti-teal px-4 py-3.5 text-white">
                <span className="font-display text-lg">Total</span>
                <span className="text-xl font-bold tabular-nums">
                  {formatPrice(totals.grandTotal)}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="mt-5 flex items-center gap-2 rounded-xl bg-gray-50 p-3 text-xs text-gray-600">
          <LockIcon />
          <span>{paymentNote}</span>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  className = "",
  valueClassName = "",
}: {
  label: string;
  value: ReactNode;
  className?: string;
  valueClassName?: string;
}) {
  return (
    <div className={`flex justify-between gap-4 ${className}`}>
      <span className="text-gray-600">{label}</span>
      <span className={`tabular-nums ${valueClassName}`}>{value}</span>
    </div>
  );
}

function TagIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M20.59 13.41 11 3H4v7l9.59 9.59a2 2 0 0 0 2.82 0l4.18-4.18a2 2 0 0 0 0-2.82Z" />
      <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
