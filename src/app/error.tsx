"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 antialiased">
        <div className="max-w-md text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#1A8A8F]">
            Something went wrong
          </p>
          <h1 className="mt-2 font-display text-3xl text-mohasti-teal-dark">
            We hit a snag
          </h1>
          <p className="mt-3 text-sm text-gray-600">
            An unexpected error occurred. Please try again, or return to the shop.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button type="button" onClick={reset}>
              Try again
            </Button>
            <Button href="/" variant="outline">
              Go home
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
