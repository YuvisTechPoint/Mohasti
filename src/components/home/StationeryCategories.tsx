import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";

const categories = [
  {
    title: "Notebooks",
    handle: "notebooks",
    image: "/images/butterfly.png",
    alt: "Handcrafted crochet motif — Mohasti notebooks",
  },
  {
    title: "Sticker Sheets",
    handle: "bookmarks",
    image: "/images/dining-space.png",
    alt: "Rustic dining space still life — Mohasti sticker sheets",
  },
  {
    title: "Greeting Cards",
    handle: "greeting-cards",
    image: "/images/rose-tapestry.png",
    alt: "Rose tapestry crochet — Mohasti greeting cards",
  },
  {
    title: "Bookmarks",
    handle: "bookmarks",
    image: "/images/minimalistic-rose.png",
    alt: "Minimalistic rose embroidery — Mohasti bookmarks",
  },
] as const;

export function StationeryCategories() {
  return (
    <section className="bg-gray-100 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading title="Stationery" />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              href={`/collections/${cat.handle}`}
              className="stationery-card group overflow-hidden rounded-2xl bg-[#FFDE59] shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <Image
                  src={cat.image}
                  alt={cat.alt}
                  fill
                  className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <div className="flex items-center justify-between gap-2 bg-[#FFDE59] px-3 py-3 sm:gap-3 sm:px-4 sm:py-4">
                <h3 className="font-display text-sm font-semibold leading-snug text-[#0f5c60] transition-colors duration-300 group-hover:text-[#1a8a8f] sm:text-base">
                  {cat.title}
                </h3>
                <span className="launch-card-arrow shrink-0 scale-90 sm:scale-100" aria-hidden>
                  <ArrowUpRightIcon />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}
