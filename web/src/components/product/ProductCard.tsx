import Link from "next/link";
import type { Product } from "@/types";
import { ProductMedia } from "@/components/product/ProductMedia";
import { Badge } from "@/components/ui/Badge";
import { PromoBadge } from "@/components/ui/PromoBadge";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";

const TEAL_FOOTER_BG = "#1A8A8F";

export function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (product: Product) => void;
}) {
  const disabled = product.status === "sold_out";
  const tealFooter =
    product.collection === "postcards" ||
    product.collection === "greeting-cards";

  return (
    <article className="product-card group relative h-full w-full">
      <Link
        href={`/products/${product.handle}`}
        className="product-card-shell block h-full"
      >
        <div className="card-elevated product-shine product-card-inner relative flex h-full flex-col overflow-hidden transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[var(--shadow-card)] group-hover:ring-1 group-hover:ring-mohasti-cyan/40">
          <Badge status={product.status} />
          {product.promoLabel && (
            <PromoBadge
              label={product.promoLabel}
              className="absolute right-2 top-2 z-10 shadow-sm sm:right-3 sm:top-3"
            />
          )}

          <div className="product-card-media relative aspect-square w-full shrink-0 overflow-hidden bg-gray-100">
            <ProductMedia
              product={product}
              className="absolute inset-0 h-full w-full"
              imageClassName="transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>

          <div
            className={cn(
              "product-card-footer-body flex shrink-0 flex-col justify-between gap-1",
              tealFooter ? "!bg-[#1A8A8F]" : "product-card-footer",
            )}
            style={tealFooter ? { backgroundColor: TEAL_FOOTER_BG } : undefined}
          >
            <div className="flex items-center justify-between gap-2">
              <h3
                className={cn(
                  "product-card-title min-w-0 flex-1 line-clamp-2",
                  tealFooter ? "text-white" : "text-[#0f5c60]",
                )}
              >
                {product.title}
              </h3>
              <span
                className={cn(
                  "launch-card-arrow shrink-0",
                  tealFooter
                    ? "scale-90 sm:scale-100 launch-card-arrow--on-teal"
                    : "launch-card-arrow--compact",
                )}
                aria-hidden
              >
                <ArrowUpRightIcon large={tealFooter} />
              </span>
            </div>
            <div className="product-card-price-row flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <p
                className={cn(
                  "text-sm font-semibold sm:text-base",
                  tealFooter ? "text-white" : "text-[#0f5c60]",
                )}
              >
                {formatPrice(product.price)}
              </p>
              {product.compareAtPrice && (
                <p
                  className={cn(
                    "text-xs line-through sm:text-sm",
                    tealFooter ? "text-white/55" : "text-[#0f5c60]/45",
                  )}
                >
                  {formatPrice(product.compareAtPrice)}
                </p>
              )}
              {product.isSubscription && (
                <span
                  className={cn(
                    "text-xs",
                    tealFooter ? "text-white/75" : "text-[#0f5c60]/65",
                  )}
                >
                  /month
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {!disabled && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onAdd(product);
          }}
          className={cn(
            "absolute right-2 rounded-lg px-3 py-2 text-xs font-semibold shadow-lg sm:right-3 sm:px-4",
            "bottom-[calc(var(--product-card-footer-h)+0.5rem)]",
            "opacity-100 transition-all duration-200 lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100",
            tealFooter
              ? "bg-[#FFDE59] text-[#0f5c60] hover:opacity-90 hover:shadow-[#FFDE59]/40"
              : "bg-mohasti-teal text-white hover:bg-mohasti-cyan hover:shadow-mohasti-cyan/30",
          )}
        >
          + Add
        </button>
      )}
    </article>
  );
}

function ArrowUpRightIcon({ large = false }: { large?: boolean }) {
  const size = large ? 18 : 14;
  return (
    <svg
      width={size}
      height={size}
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
