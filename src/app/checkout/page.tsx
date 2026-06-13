import { Suspense } from "react";
import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";
import { getPublicKey, isRazorpayConfigured } from "@/lib/razorpay";

export const metadata = {
  title: "Checkout",
  description: "Secure checkout for Mohasti art and stationery.",
};

function CheckoutLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-mohasti-cyan border-t-transparent" />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutFlow
        demoMode={!isRazorpayConfigured()}
        razorpayPublicKey={getPublicKey()}
      />
    </Suspense>
  );
}
