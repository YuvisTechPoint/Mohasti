"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/types";
import { useCart } from "@/components/providers/CartProvider";
import { Badge } from "@/components/ui/Badge";
import { PromoBadge } from "@/components/ui/PromoBadge";
import { Button } from "@/components/ui/Button";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductMedia } from "@/components/product/ProductMedia";
import { formatPrice } from "@/lib/format";
import { products } from "@/lib/products";

export function ProductDetailView({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem, buyNow } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "description" | "details" | "shipping" | "care"
  >("description");

  const related = products
    .filter(
      (p) => p.collection === product.collection && p.handle !== product.handle,
    )
    .slice(0, 4);

  const disabled = product.status === "sold_out";
  const tabs = [
    { id: "description" as const, label: "Description", content: product.description },
    { id: "details" as const, label: "Details", content: product.details },
    { id: "shipping" as const, label: "Shipping", content: product.shipping },
    { id: "care" as const, label: "Care", content: product.care },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
      <nav className="mb-8 text-sm text-gray-600">
        <Link href="/" className="hover:text-mohasti-cyan">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/collections/${product.collection}`}
          className="hover:text-mohasti-cyan"
        >
          {product.collection.replace("-", " ")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-mohasti-teal-dark">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[55%_45%]">
        <div>
          <div className="relative overflow-hidden rounded-2xl card-elevated">
            <Badge status={product.status} />
            {product.promoLabel && (
              <PromoBadge
                label={product.promoLabel}
                className="absolute right-3 top-3 z-10 shadow-sm"
              />
            )}
            <ProductMedia
              product={product}
              className="aspect-square w-full"
              priority
            />
          </div>
          {product.image ? (
            <div className="mt-4 flex gap-3">
              <div className="relative h-20 w-20 overflow-hidden rounded-lg ring-2 ring-mohasti-cyan">
                <ProductMedia product={product} className="h-full w-full" />
              </div>
            </div>
          ) : (
            <div className="mt-4 flex gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 w-20 rounded-lg border border-gray-300 opacity-60"
                  style={{
                    background: product.imageGradient,
                    filter: `hue-rotate(${i * 15}deg)`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            {product.promoLabel && <PromoBadge label={product.promoLabel} />}
          </div>

          <h1 className="mt-3 font-display text-3xl font-medium text-mohasti-teal md:text-4xl">
            {product.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-baseline gap-3">
            <p className="text-2xl font-semibold text-mohasti-teal">
              {formatPrice(product.price)}
            </p>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <>
                <p className="text-lg text-gray-400 line-through">
                  {formatPrice(product.compareAtPrice)}
                </p>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                  Save {formatPrice(product.compareAtPrice - product.price)}
                </span>
              </>
            )}
            {product.isSubscription && (
              <span className="text-base text-gray-500">/month</span>
            )}
          </div>
          <p className="mt-4 leading-relaxed text-mohasti-teal-dark/90">
            {product.shortDescription}
          </p>

          {product.highlights && product.highlights.length > 0 && (
            <ul className="mt-6 space-y-2 rounded-xl border border-mohasti-yellow/40 bg-mohasti-yellow/10 px-4 py-4">
              {product.highlights.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-sm leading-relaxed text-mohasti-teal-dark"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mohasti-gold" />
                  {item}
                </li>
              ))}
            </ul>
          )}

          {!disabled && (
            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center rounded-lg border border-gray-300">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex min-h-11 min-w-11 items-center justify-center px-2"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="min-w-[2rem] text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex min-h-11 min-w-11 items-center justify-center px-2"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              className="flex-1"
              disabled={disabled}
              onClick={() => addItem(product, quantity)}
            >
              {product.status === "pre_order" ? "Pre-order" : "Add to Cart"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              disabled={disabled}
              onClick={() => {
                buyNow(product, quantity);
                router.push("/checkout");
              }}
            >
              Buy Now
            </Button>
          </div>

          <div className="mt-10 border-t border-gray-300 pt-6">
            <div className="flex gap-2 border-b border-gray-300">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "border-b-2 border-mohasti-cyan text-mohasti-teal"
                      : "text-gray-600 hover:text-mohasti-teal"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-mohasti-teal-dark/90">
              {activeTab === "description" ? (
                <>
                  {product.description.split("\n\n").map((paragraph) => (
                    <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                  ))}
                  <Link
                    href={`/collections/${product.collection}`}
                    className="inline-flex items-center gap-1 font-medium text-mohasti-teal transition-colors hover:text-mohasti-cyan"
                  >
                    Shop the collection →
                  </Link>
                </>
              ) : activeTab === "details" && product.specifications?.length ? (
                <dl className="grid gap-3 sm:grid-cols-2">
                  {product.specifications.map((spec) => (
                    <div
                      key={spec.label}
                      className="rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3"
                    >
                      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {spec.label}
                      </dt>
                      <dd className="mt-1 font-medium text-mohasti-teal-dark">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p>{tabs.find((t) => t.id === activeTab)?.content}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <section className="mt-20 border-t border-gray-300 pt-16">
        <h2 className="font-display text-2xl font-medium text-mohasti-teal">
          The Story Behind This Piece
        </h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-mohasti-teal-dark/90">
          {product.story}
        </p>
      </section>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 font-display text-2xl font-medium text-mohasti-teal">
            You may also like
          </h2>
          <ProductGrid products={related} />
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.title,
            description: product.description,
            offers: {
              "@type": "Offer",
              price: product.price,
              priceCurrency: "INR",
              availability:
                product.status === "sold_out"
                  ? "https://schema.org/OutOfStock"
                  : "https://schema.org/InStock",
            },
          }),
        }}
      />
    </div>
  );
}
