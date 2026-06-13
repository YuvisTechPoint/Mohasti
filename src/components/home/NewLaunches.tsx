import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";

const launches = [
  {
    handle: "postcards",
    title: "Postcards",
    image: "/images/minimalistic-rose.png",
    alt: "Minimalistic rose embroidery — Mohasti new launch",
  },
  {
    handle: "greeting-cards",
    title: "Greeting Cards",
    image: "/images/3d-petal-red-bag.png",
    alt: "3D petal red bag — Mohasti new launch",
  },
  {
    handle: "notebooks",
    title: "Journals & Notebooks",
    image: "/images/deep-blue-hue.png",
    alt: "Deep blue hue crochet pouch — Mohasti new launch",
  },
  {
    handle: "bookmarks",
    title: "Bookmarks & Stickers",
    image: "/images/rose-tapestry.png",
    alt: "Rose tapestry crochet — Mohasti new launch",
  },
] as const;

export function NewLaunches() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          title="New Launches"
          className="[&_h2]:text-mohasti-teal-dark"
        />
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-4 pb-4 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:snap-none md:px-0">
          {launches.map((item) => (
            <Link
              key={item.handle}
              href={`/collections/${item.handle}`}
              className="launch-card group min-w-[240px] shrink-0 snap-start sm:min-w-[260px] md:min-w-0"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  sizes="(max-width: 768px) 260px, 25vw"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100"
                  aria-hidden
                />
              </div>

              <div className="launch-card-line" aria-hidden />

              <div className="flex items-center justify-between gap-3 bg-[#FFDE59] px-5 py-4">
                <h3 className="font-display text-xl font-semibold leading-snug text-[#0f5c60] transition-colors duration-300 group-hover:text-[#1a8a8f]">
                  {item.title}
                </h3>
                <span className="launch-card-arrow" aria-hidden>
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
