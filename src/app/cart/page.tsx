import { CartPageClient } from "@/components/cart/CartPageClient";
import { isRazorpayConfigured } from "@/lib/razorpay";

export const metadata = {
  title: "Cart",
  description: "Review your Mohasti cart and pay securely.",
};

export default function CartPage() {
  return <CartPageClient demoMode={!isRazorpayConfigured()} />;
}
