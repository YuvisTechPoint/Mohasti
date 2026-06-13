import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

export function BrandStory() {
  return (
    <section className="bg-off-white py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 md:grid-cols-2 md:px-6">
        <div className="mx-auto w-full max-w-md md:mx-0 md:max-w-none">
          <Image
            src="/images/golden-hour-glow.png"
            alt="Golden hour glow — handcrafted Mohasti piece in warm sunlight"
            width={612}
            height={396}
            className="h-auto w-full rounded-2xl shadow-[var(--shadow-card)] ring-1 ring-gray-200/80"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div>
          <h2 className="font-display text-3xl font-medium text-mohasti-teal md:text-4xl">
            Born from stillness, made for everyday life.
          </h2>
          <p className="mt-4 leading-relaxed text-mohasti-teal-dark/90">
            Mohasti began as a quiet practice — turning moments of reflection
            into art you can hold, send, and live with. We believe beauty belongs
            in the ordinary: a postcard on a desk, a journal by the bed, a
            bookmark in a well-loved book.
          </p>
          <p className="mt-4 leading-relaxed text-mohasti-teal-dark/90">
            Each piece is designed to bring a little light into your daily
            rituals — without asking you to change who you are.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/pages/about"
              className="font-medium text-mohasti-teal transition-colors hover:text-mohasti-cyan"
            >
              Read more →
            </Link>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border-2 border-mohasti-gold",
                "bg-transparent px-4 py-2.5 text-sm font-medium text-mohasti-teal-dark",
                "transition-colors hover:border-mohasti-teal hover:text-mohasti-teal",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mohasti-lotus-glow focus-visible:ring-offset-2",
              )}
            >
              <InstagramIcon />
              Follow on IG
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
