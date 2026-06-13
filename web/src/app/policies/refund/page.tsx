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
      <div className="mt-8 space-y-4 leading-relaxed text-mohasti-teal-dark/90">
        {children}
      </div>
    </div>
  );
}

export const metadata = { title: "Refund Policy" };

export default function RefundPolicyPage() {
  return (
    <PolicyLayout title="Refund Policy">
      <p>
        If your order arrives damaged or incorrect, contact us within 7 days at
        hello@mohasti.com with photos. We will replace or refund at no extra
        cost.
      </p>
      <p>
        Due to the nature of printed art and stationery, we cannot accept returns
        on items that have been written in, used, or removed from packaging.
      </p>
      <p>
        Pre-orders may be cancelled for a full refund before the item ships.
      </p>
    </PolicyLayout>
  );
}
