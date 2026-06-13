import Link from "next/link";
import type { Product } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatPrice } from "@/lib/format";

export function FeaturedFavourites({ products }: { products: Product[] }) {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-10 text-center">
          <p className="font-accent mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-mohasti-teal">
            Curated for you
          </p>
          <SectionHeading
            title="Mohasti Favourites"
            subtitle="Beloved pieces and limited collections from our circle."
            className="mb-0"
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.handle}
              href={`/products/${product.handle}`}
              className="group overflow-hidden rounded-2xl border border-gray-300 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative">
                <Badge status={product.status} />
                <div
                  className="aspect-[16/10] transition-transform duration-300 group-hover:scale-[1.02]"
                  style={{ background: product.imageGradient }}
                />
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="font-display text-xl font-medium text-mohasti-teal">
                  {product.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-mohasti-teal-dark/80 line-clamp-3">
                  {product.shortDescription}
                </p>
                <div className="mt-4">
                  <p className="font-body text-base font-semibold text-[#0f5c60]">
                    {formatPrice(product.price)}
                    {product.isSubscription && (
                      <span className="font-medium text-mohasti-teal-dark/70">
                        /month
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
