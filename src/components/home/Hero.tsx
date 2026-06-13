import Image from "next/image";
import { Button } from "@/components/ui/Button";

import { formatPrice } from "@/lib/format";

const TRUST_ITEMS = [
  `Free shipping over ${formatPrice(1500)}`,
  "Secure UPI & Cards",
  "GST Invoice",
];

export function Hero() {
  return (
    <section className="hero-minimal relative min-h-[72vh] overflow-hidden sm:min-h-[80vh] lg:min-h-[88vh]">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-off-white to-mohasti-teal/[0.03]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-mohasti-cyan/[0.07] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-mohasti-teal/[0.04] blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 py-12 sm:gap-14 sm:py-16 md:flex-row md:items-center md:gap-16 md:px-6 md:py-28 lg:py-32">
        <div className="flex-1 text-center md:text-left">
          <p className="font-accent mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-mohasti-teal">
            Mindful stationery
          </p>

          <h1 className="font-display text-3xl font-medium leading-[1.12] text-mohasti-teal-dark sm:text-[2.5rem] md:text-5xl lg:text-[3.25rem]">
            Art inspired by stillness,
            <span className="mt-1 block text-mohasti-teal/90">
              crafted for everyday rituals.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-gray-600 md:mx-0 md:max-w-lg md:text-lg">
            Original art and mindful stationery — postcards, journals, and
            keepsakes that bring light into daily life.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3 md:justify-start">
            <Button href="/collections/all" size="lg">
              Shop Collection
            </Button>
            <Button
              href="/pages/about"
              variant="ghost"
              size="lg"
              className="border border-gray-200 bg-white text-mohasti-teal-dark hover:border-mohasti-teal/30 hover:bg-white"
            >
              Our Story
            </Button>
          </div>

          <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:justify-start">
            {TRUST_ITEMS.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-sm text-gray-500"
              >
                <span
                  className="h-1 w-1 shrink-0 rounded-full bg-mohasti-teal/50"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-1 justify-center md:justify-end">
          <div className="relative w-full max-w-[320px] sm:max-w-[360px] lg:max-w-[400px]">
            <div
              className="absolute -inset-3 rounded-3xl border border-mohasti-teal/10 bg-white/60"
              aria-hidden
            />
            <Image
              src="/brand/mohasti-logo.svg"
              alt="Mohasti brand — lotus, heart, and moon"
              width={380}
              height={480}
              className="relative w-full rounded-2xl shadow-[var(--shadow-card)]"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
