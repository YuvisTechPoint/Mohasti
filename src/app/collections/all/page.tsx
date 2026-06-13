import Link from "next/link";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { collections } from "@/lib/collections";
import { products } from "@/lib/products";

export const metadata = {
  title: "All Products",
  description: "Browse all Mohasti art, postcards, journals, and mindful stationery.",
};

export default function AllProductsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 md:px-6 md:py-16">
      <nav className="mb-6 text-sm text-gray-600">
        <Link href="/" className="hover:text-mohasti-cyan">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span>Shop</span>
      </nav>
      <SectionHeading
        title="All Products"
        subtitle="Original art and mindful stationery for everyday rituals."
        align="left"
      />
      <div className="category-scroll -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:mb-10 md:flex-wrap md:overflow-visible md:px-0">
        {collections.map((c) => (
          <Link
            key={c.handle}
            href={`/collections/${c.handle}`}
            className="shrink-0 rounded-full border border-gray-300 px-4 py-2 text-sm text-mohasti-teal-dark transition-colors hover:border-mohasti-cyan hover:text-mohasti-cyan md:rounded-lg md:py-1.5"
          >
            {c.title}
          </Link>
        ))}
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
