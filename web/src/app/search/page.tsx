"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { searchProducts } from "@/lib/products";
import {
  hasSearchResults,
  searchSite,
  totalSearchResults,
} from "@/lib/search";
import { cn } from "@/lib/cn";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const trimmed = query.trim();
  const grouped = useMemo(
    () => (trimmed ? searchSite(trimmed, 50) : null),
    [trimmed],
  );
  const productResults = searchProducts(trimmed);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
      <h1 className="font-display text-3xl text-mohasti-teal-dark md:text-4xl">
        {trimmed ? `Results for “${trimmed}”` : "Search"}
      </h1>

      <SearchForm defaultQuery={query} />

      <div className="mt-10">
        {!trimmed ? (
          <p className="font-body text-gray-600">
            Enter a search term to find products, collections, and journal posts.
          </p>
        ) : grouped && !hasSearchResults(grouped) && productResults.length === 0 ? (
          <p className="font-body text-gray-600">
            No results found.{" "}
            <Link href="/collections/all" className="text-mohasti-teal underline">
              Browse all products
            </Link>
          </p>
        ) : (
          <>
            {grouped && grouped.collections.length > 0 && (
              <SearchSection title="Collections">
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {grouped.collections.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="block rounded-xl border border-gray-200 px-4 py-4 transition-colors hover:border-mohasti-teal/30 hover:bg-mohasti-teal/[0.03]"
                      >
                        <p className="font-medium text-mohasti-teal-dark">{item.title}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                          {item.subtitle}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </SearchSection>
            )}

            {productResults.length > 0 && (
              <SearchSection
                title="Products"
                className={grouped && grouped.collections.length > 0 ? "mt-12" : undefined}
              >
                <ProductGrid products={productResults} />
              </SearchSection>
            )}

            {grouped && grouped.journal.length > 0 && (
              <SearchSection title="Journal" className="mt-12">
                <ul className="space-y-3">
                  {grouped.journal.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="block rounded-xl border border-gray-200 px-4 py-4 transition-colors hover:border-mohasti-teal/30 hover:bg-mohasti-teal/[0.03]"
                      >
                        <p className="font-medium text-mohasti-teal-dark">{item.title}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                          {item.subtitle}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </SearchSection>
            )}

            {grouped && hasSearchResults(grouped) && (
              <p className="mt-10 font-body text-sm text-gray-500">
                {totalSearchResults(grouped)} result
                {totalSearchResults(grouped) === 1 ? "" : "s"} across Mohasti
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function SearchForm({ defaultQuery }: { defaultQuery: string }) {
  return (
    <form key={defaultQuery} className="mt-6 flex gap-2" action="/search" method="GET">
      <input
        name="q"
        defaultValue={defaultQuery}
        placeholder="Search products, collections, journal..."
        className="flex-1 rounded-full border border-gray-300 px-5 py-3 font-body outline-none focus:border-mohasti-teal focus:ring-2 focus:ring-[#FFDE59]/50"
      />
      <button
        type="submit"
        className="rounded-lg bg-mohasti-teal px-6 py-3 font-body text-sm font-medium text-white transition-colors hover:bg-mohasti-teal-dark"
      >
        Search
      </button>
    </form>
  );
}

function SearchSection({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn(className)}>
      <h2 className="mb-4 font-body text-xs font-semibold uppercase tracking-[0.14em] text-mohasti-teal/55">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchResults />
    </Suspense>
  );
}
