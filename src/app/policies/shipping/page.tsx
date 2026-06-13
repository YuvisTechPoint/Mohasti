import Link from "next/link";

function PolicyLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
      <nav className="mb-6 text-sm text-gray-600">
        <Link href="/" className="hover:text-mohasti-cyan">
          Home
        </Link>
      </nav>
      <h1 className="font-display text-4xl font-medium text-mohasti-teal">
        {title}
      </h1>
      <div className="prose-mt mt-8 space-y-4 leading-relaxed text-mohasti-teal-dark/90">
        {children}
      </div>
    </div>
  );
}

export const metadata = { title: "Shipping Policy" };

export default function ShippingPolicyPage() {
  return (
    <PolicyLayout title="Shipping Policy">
      <p>
        We ship across India within 3–7 business days. International orders are
        accepted via PayPal and may take 10–21 business days depending on
        destination.
      </p>
      <p>
        Pre-order items ship on the date specified on the product page. You will
        receive a tracking number once your order is dispatched.
      </p>
      <p>
        Shipping costs are calculated at checkout based on weight and
        destination. Free shipping on orders above ₹ 1,500 within India.
      </p>
    </PolicyLayout>
  );
}
