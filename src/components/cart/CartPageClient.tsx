"use client";

import Link from "next/link";
import Script from "next/script";
import { useMemo, useState } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { OrderSummaryPanel } from "@/components/checkout/OrderSummaryPanel";
import { CartShippingForm } from "@/components/cart/CartShippingForm";
import { Button } from "@/components/ui/Button";
import { useDiscountCode } from "@/lib/use-discount-code";
import { useCheckoutPayment } from "@/lib/use-checkout-payment";
import { formatPrice } from "@/lib/format";
import {
  getSavedShipping,
  isShippingComplete,
  saveShipping,
  withAuthShipping,
} from "@/lib/shipping-prefs";
import type { ShippingAddress } from "@/types";

export function CartPageClient({ demoMode }: { demoMode: boolean }) {
  const { user } = useAuth();
  const { items, updateQuantity, removeItem, clearCart, isHydrated } =
    useCart();
  const discount = useDiscountCode();
  const [shipping, setShipping] = useState<ShippingAddress>(() =>
    getSavedShipping(),
  );

  const effectiveShipping = useMemo(
    () => withAuthShipping(shipping, user),
    [shipping, user],
  );

  const shippingReady = isShippingComplete(shipping, {
    email: user?.email,
    fullName: user?.displayName,
  });

  const { pay, loading, error, setError } = useCheckoutPayment({
    items,
    shipping: effectiveShipping,
    discountCode: discount.appliedCode,
    onClearCart: clearCart,
  });

  const updateShipping = (field: keyof ShippingAddress, value: string) => {
    setError("");
    setShipping((prev) => {
      const next = { ...prev, [field]: value };
      saveShipping(withAuthShipping(next, user));
      return next;
    });
  };

  const handlePay = () => {
    if (!shippingReady) {
      setError("Please complete delivery details below to pay.");
      return;
    }
    pay();
  };

  if (!isHydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-mohasti-cyan border-t-transparent" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center md:py-32">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-mohasti-cyan/20 to-mohasti-yellow/20">
          <span className="text-4xl">🛒</span>
        </div>
        <h1 className="font-display text-3xl text-mohasti-teal">Your Cart</h1>
        <p className="mt-3 text-gray-600">
          Your cart is empty — discover mindful art and stationery.
        </p>
        <Button href="/collections/all" className="mt-8" size="lg">
          Explore Collection
        </Button>
      </div>
    );
  }

  return (
    <>
      {!demoMode && (
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
      )}

      <div className="mx-auto max-w-6xl px-4 py-8 pb-24 sm:py-10 md:px-6 md:py-14 md:pb-14">
        <h1 className="font-display text-3xl text-mohasti-teal md:text-4xl">
          Your Cart
          <span className="ml-2 text-lg font-normal text-gray-500">
            ({items.reduce((s, i) => s + i.quantity, 0)} items)
          </span>
        </h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="order-2 space-y-4 lg:order-1">
            {items.map((item) => (
              <div
                key={item.handle}
                className="card-elevated flex gap-3 p-3 sm:gap-4 sm:p-4 md:gap-6 md:p-5"
              >
                <div
                  className="h-20 w-20 shrink-0 rounded-xl ring-1 ring-gray-200 sm:h-24 sm:w-24 md:h-28 md:w-28"
                  style={{ background: item.imageGradient }}
                />
                <div className="flex min-w-0 flex-1 flex-col gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/products/${item.handle}`}
                      className="line-clamp-2 font-semibold text-mohasti-teal-dark hover:text-mohasti-cyan"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-1 text-sm text-gray-600">
                      {formatPrice(item.price)} each
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.handle, item.quantity - 1)
                        }
                        className="flex min-h-11 min-w-9 items-center justify-center px-3 text-lg leading-none hover:text-mohasti-cyan"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="min-w-[2rem] text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.handle, item.quantity + 1)
                        }
                        className="flex min-h-11 min-w-9 items-center justify-center px-3 text-lg leading-none hover:text-mohasti-cyan"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-semibold tabular-nums text-mohasti-teal">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeItem(item.handle)}
                        className="min-h-11 px-1 text-xs text-gray-500 underline hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <CartShippingForm shipping={shipping} onChange={updateShipping} />
          </div>

          <div className="order-1 space-y-4 lg:order-2 lg:sticky lg:top-24 lg:self-start">
            <OrderSummaryPanel
              items={items}
              customerState={shipping.state}
              discount={discount}
              swipeToPay={{
                onSwipe: handlePay,
                loading,
                disabled: loading || !shippingReady,
              }}
              swipeLabel={
                shippingReady
                  ? "Swipe to pay securely"
                  : "Complete delivery details first"
              }
            />

            {error && (
              <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            {!shippingReady && (
              <p className="text-center text-xs text-amber-700">
                Fill in delivery details on the left to unlock payment.
              </p>
            )}

            {!loading && (
              <Button
                type="button"
                className="w-full"
                size="lg"
                onClick={handlePay}
                disabled={!shippingReady}
              >
                Pay now
              </Button>
            )}

            <Button href="/checkout" variant="outline" className="w-full">
              Full checkout
            </Button>
            <Button
              href="/collections/all"
              variant="outline"
              className="w-full"
            >
              Continue Shopping
            </Button>
            <button
              type="button"
              onClick={clearCart}
              className="w-full text-center text-xs text-gray-500 underline"
            >
              Clear cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
