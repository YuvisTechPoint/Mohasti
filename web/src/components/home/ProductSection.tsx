import Link from "next/link";
import type { Product } from "@/types";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ProductSection({
  title,
  products,
  collectionHandle,
  centerTitle = false,
}: {
  title: string;
  products: Product[];
  collectionHandle?: string;
  centerTitle?: boolean;
}) {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {centerTitle ? (
          <div className="relative mb-10">
            <SectionHeading title={title} align="center" className="mb-0" />
            {collectionHandle && (
              <Link
                href={`/collections/${collectionHandle}`}
                className="absolute right-0 top-1/2 hidden -translate-y-1/2 text-sm font-medium text-mohasti-teal hover:text-mohasti-cyan md:block"
              >
                View all →
              </Link>
            )}
          </div>
        ) : (
          <div className="mb-10 flex items-end justify-between">
            <SectionHeading title={title} className="mb-0 text-left" align="left" />
            {collectionHandle && (
              <Link
                href={`/collections/${collectionHandle}`}
                className="hidden shrink-0 text-sm font-medium text-mohasti-teal hover:text-mohasti-cyan md:block"
              >
                View all →
              </Link>
            )}
          </div>
        )}
        <ProductGrid products={products} />
        {collectionHandle && (
          <div className="mt-8 text-center md:hidden">
            <Link
              href={`/collections/${collectionHandle}`}
              className="text-sm font-medium text-mohasti-teal hover:text-mohasti-cyan"
            >
              View all →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
