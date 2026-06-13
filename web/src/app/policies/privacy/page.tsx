import Link from "next/link";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
      <nav className="mb-6 text-sm text-gray-600">
        <Link href="/" className="hover:text-mohasti-cyan">
          Home
        </Link>
      </nav>
      <h1 className="font-display text-4xl font-medium text-mohasti-teal">
        Privacy Policy
      </h1>
      <div className="mt-8 space-y-4 leading-relaxed text-mohasti-teal-dark/90">
        <p>
          Mohasti respects your privacy. We collect only the information needed
          to process orders and send newsletters you subscribe to.
        </p>
        <p>
          We do not sell your data to third parties. Payment processing is
          handled securely by our payment partners.
        </p>
        <p>
          You may unsubscribe from marketing emails at any time using the link in
          each newsletter.
        </p>
        <p>
          For questions, contact{" "}
          <a
            href="mailto:hello@mohasti.com"
            className="text-mohasti-teal underline"
          >
            hello@mohasti.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
