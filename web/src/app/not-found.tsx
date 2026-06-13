import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div
        className="mb-8 h-32 w-32 rounded-full opacity-80"
        style={{
          background:
            "linear-gradient(135deg, #0CC0DF 0%, #7DD956 35%, #FFDE59 100%)",
        }}
        aria-hidden
      />
      <h1 className="font-display text-4xl font-medium text-mohasti-teal">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-mohasti-teal-dark/80">
        This path has wandered off the ritual. Let&apos;s return to stillness.
      </p>
      <Button href="/collections/all" className="mt-8" size="lg">
        Return to Shop
      </Button>
      <Link
        href="/"
        className="mt-4 text-sm text-mohasti-teal hover:text-mohasti-cyan"
      >
        Back to home
      </Link>
    </div>
  );
}
