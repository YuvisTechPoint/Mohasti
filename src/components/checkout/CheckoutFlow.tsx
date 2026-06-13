"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/providers/CartProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";
import { OrderSummaryPanel } from "@/components/checkout/OrderSummaryPanel";
import { PaymentMethodOptions, type CheckoutPaymentMode } from "@/components/checkout/PaymentMethodOptions";
import type { ShippingAddress } from "@/types";
import { useDiscountCode } from "@/lib/use-discount-code";
import { useCheckoutPayment } from "@/lib/use-checkout-payment";
import {
  getSavedShipping,
  saveShipping,
  setPreferredShippingState,
  withAuthShipping,
} from "@/lib/shipping-prefs";

const INDIAN_STATES = [
  "Maharashtra",
  "Delhi",
  "Karnataka",
  "Tamil Nadu",
  "Gujarat",
  "Rajasthan",
  "West Bengal",
  "Uttar Pradesh",
  "Telangana",
  "Kerala",
  "Other",
];

export function CheckoutFlow({
  demoMode,
}: {
  demoMode: boolean;
  razorpayPublicKey?: string | null;
}) {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { items, clearCart, isHydrated } = useCart();
  const discount = useDiscountCode();
  const [step, setStep] = useState(1);
  const [paymentMode, setPaymentMode] = useState<CheckoutPaymentMode>("online");
  const [shipping, setShipping] = useState<ShippingAddress>(
    () => getSavedShipping(),
  );
  const effectiveShipping = useMemo(
    () => withAuthShipping(shipping, user),
    [shipping, user],
  );

  const { pay: handlePayment, loading, error } = useCheckoutPayment({
    items,
    shipping: effectiveShipping,
    discountCode: discount.appliedCode,
    paymentMethod: paymentMode,
    onClearCart: clearCart,
  });

  useEffect(() => {
    const fromUrl = searchParams.get("coupon") ?? searchParams.get("code");
    if (fromUrl && !discount.isApplied) {
      discount.applyCode(fromUrl);
    }
    // Only apply URL coupon once on mount / param change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const updateShipping = (field: keyof ShippingAddress, value: string) => {
    setShipping((prev) => {
      const next = { ...prev, [field]: value };
      saveShipping(withAuthShipping(next, user));
      if (field === "state") setPreferredShippingState(value);
      return next;
    });
  };

  if (!isHydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-mohasti-cyan border-t-transparent" />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
          <CartEmptyIcon />
        </div>
        <h1 className="font-display text-3xl text-mohasti-teal">Checkout</h1>
        <p className="mt-3 text-gray-600">Your cart is empty.</p>
        <Button href="/collections/all" className="mt-8" size="lg">
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <>
      {!demoMode && (
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      )}

      <div className="mx-auto max-w-6xl px-4 py-8 pb-24 sm:py-10 md:px-6 md:py-14 md:pb-14">
        <div className="mb-2 text-center">
          <h1 className="font-display text-3xl text-mohasti-teal md:text-4xl">
            Checkout
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Secure payment · GST invoice included
          </p>
        </div>

        <CheckoutSteps current={step} />

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="order-2 card-elevated p-4 sm:p-6 md:p-8 lg:order-1">
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="font-display text-xl text-mohasti-teal">
                  Shipping Details
                </h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    label="Full Name"
                    required
                    value={shipping.fullName}
                    onChange={(e) => updateShipping("fullName", e.target.value)}
                    className="sm:col-span-2"
                  />
                  <Input
                    label="Email"
                    type="email"
                    required
                    value={shipping.email}
                    onChange={(e) => updateShipping("email", e.target.value)}
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    required
                    value={shipping.phone}
                    onChange={(e) => updateShipping("phone", e.target.value)}
                    placeholder="+91"
                  />
                  <Input
                    label="Address Line 1"
                    required
                    value={shipping.addressLine1}
                    onChange={(e) => updateShipping("addressLine1", e.target.value)}
                    className="sm:col-span-2"
                  />
                  <Input
                    label="Address Line 2"
                    value={shipping.addressLine2 ?? ""}
                    onChange={(e) => updateShipping("addressLine2", e.target.value)}
                    className="sm:col-span-2"
                  />
                  <Input
                    label="City"
                    required
                    value={shipping.city}
                    onChange={(e) => updateShipping("city", e.target.value)}
                  />
                  <Select
                    label="State"
                    required
                    value={shipping.state}
                    onChange={(e) => updateShipping("state", e.target.value)}
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </Select>
                  <Input
                    label="Pincode"
                    required
                    value={shipping.pincode}
                    onChange={(e) => updateShipping("pincode", e.target.value)}
                  />
                  <Input
                    label="GSTIN (optional, for business)"
                    value={shipping.gstin ?? ""}
                    onChange={(e) => updateShipping("gstin", e.target.value)}
                    className="sm:col-span-2"
                  />
                </div>
                <Button
                  type="button"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => setStep(2)}
                  disabled={
                    !effectiveShipping.fullName ||
                    !effectiveShipping.email ||
                    !effectiveShipping.phone ||
                    !shipping.addressLine1 ||
                    !shipping.city ||
                    !shipping.pincode
                  }
                >
                  Continue to Payment
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-xl text-mohasti-teal">
                    Payment Method
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Secure checkout · GST invoice included
                  </p>
                </div>

                <PaymentMethodOptions
                  mode={paymentMode}
                  onModeChange={setPaymentMode}
                />

                {demoMode && (
                  <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                    <span className="mt-0.5 shrink-0 text-amber-600" aria-hidden>
                      <DemoIcon />
                    </span>
                    <p>
                      <strong>Demo mode:</strong> Razorpay keys not configured.
                      Payment will be simulated — order &amp; invoice still
                      generated.
                    </p>
                  </div>
                )}

                <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-mohasti-teal-dark">
                        Billing address
                      </p>
                      <p className="mt-1.5 leading-relaxed text-gray-600">
                        {effectiveShipping.fullName}
                        <br />
                        {shipping.addressLine1}
                        <br />
                        {shipping.city}, {shipping.state} {shipping.pincode}
                        <br />
                        <span className="text-gray-500">
                          {effectiveShipping.email} · {shipping.phone}
                        </span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="shrink-0 text-xs font-medium text-mohasti-teal underline-offset-2 hover:text-mohasti-cyan hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </p>
                )}

                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    disabled={loading}
                  >
                    Back
                  </Button>
                  {!loading && (
                    <Button
                      type="button"
                      size="lg"
                      onClick={handlePayment}
                      className="min-w-[200px]"
                    >
                      {paymentMode === "cod" ? "Place COD Order" : "Pay Securely"}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="order-1 lg:order-2">
            <OrderSummaryPanel
              items={items}
              customerState={shipping.state}
              discount={discount}
              swipeToPay={
                step === 2
                  ? {
                      onSwipe: handlePayment,
                      loading,
                      disabled: loading,
                    }
                  : undefined
              }
              swipeLabel={
                paymentMode === "cod"
                  ? "Swipe to place COD order"
                  : "Swipe to pay securely"
              }
              paymentNote="Secure checkout in INR (₹) · UPI · Cards · Net Banking · COD"
            />
          </div>
        </div>

        <Link
          href="/cart"
          className="mt-6 inline-block text-sm text-mohasti-teal hover:text-mohasti-cyan"
        >
          ← Back to cart
        </Link>
      </div>
    </>
  );
}

function CartEmptyIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1A8A8F" strokeWidth="1.5">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
    </svg>
  );
}

function DemoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 9v4M12 17h.01" strokeLinecap="round" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}
