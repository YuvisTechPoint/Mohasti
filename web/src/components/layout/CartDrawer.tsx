"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { CartItemThumb } from "@/components/product/CartItemThumb";
import { ProductMedia } from "@/components/product/ProductMedia";
import { formatPrice } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/pricing";
import { getCartRecommendations } from "@/lib/products";
import type { Product } from "@/types";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    addItem,
    subtotal,
    clearCart,
  } = useCart();

  const cartHandles = useMemo(() => items.map((item) => item.handle), [items]);
  const recommendations = useMemo(
    () => getCartRecommendations(cartHandles, 4),
    [cartHandles],
  );

  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(
    100,
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100,
  );

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/40 transition-opacity print:hidden"
        onClick={closeCart}
        aria-hidden
      />
      <aside
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl animate-slide-in print:hidden"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-mohasti-teal/8 bg-gradient-to-r from-mohasti-teal/[0.04] to-[#FFDE59]/20 px-6 py-4">
          <div>
            <h2 className="font-display text-xl text-mohasti-teal-dark">Your Cart</h2>
            {items.length > 0 && (
              <p className="mt-0.5 font-body text-xs text-mohasti-teal/60">
                {items.reduce((sum, item) => sum + item.quantity, 0)} item
                {items.reduce((sum, item) => sum + item.quantity, 0) === 1
                  ? ""
                  : "s"}{" "}
                · {formatPrice(subtotal)}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="site-header-icon-btn"
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <CartEmptyState
              recommendations={recommendations}
              onAdd={(product) => addItem(product)}
              onClose={closeCart}
            />
          ) : (
            <>
              <ul className="space-y-4">
                {items.map((item) => {
                  const lineTotal = item.price * item.quantity;
                  return (
                    <li
                      key={item.handle}
                      className="flex gap-4 rounded-xl border border-gray-100 bg-gray-50/60 p-3"
                    >
                      <CartItemThumb
                        title={item.title}
                        image={item.image}
                        imageGradient={item.imageGradient}
                      />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <Link
                          href={`/products/${item.handle}`}
                          onClick={closeCart}
                          className="line-clamp-2 font-body text-sm font-medium text-mohasti-teal-dark transition-colors hover:text-mohasti-teal"
                        >
                          {item.title}
                        </Link>
                        <p className="mt-0.5 font-body text-xs text-gray-500">
                          {formatPrice(item.price)} each
                        </p>
                        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                          <div className="flex items-center rounded-lg border border-gray-200 bg-white">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.handle, item.quantity - 1)
                              }
                              className="flex min-h-11 min-w-9 items-center justify-center px-3 font-body text-sm text-mohasti-teal-dark"
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="min-w-[1.5rem] text-center font-body text-sm">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.handle, item.quantity + 1)
                              }
                              className="flex min-h-11 min-w-9 items-center justify-center px-3 font-body text-sm text-mohasti-teal-dark"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="font-body text-sm font-semibold text-mohasti-teal-dark">
                              {formatPrice(lineTotal)}
                            </p>
                            <button
                              type="button"
                              onClick={() => removeItem(item.handle)}
                              className="font-body text-[11px] text-gray-500 underline-offset-2 hover:text-mohasti-teal hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-6 space-y-5">
                <CartShippingProgress
                  remaining={freeShippingRemaining}
                  progress={freeShippingProgress}
                  qualified={freeShippingRemaining === 0}
                />
                <CartPerksStrip />
                {recommendations.length > 0 && (
                  <CartRecommendations
                    products={recommendations}
                    onAdd={(product) => addItem(product)}
                    onClose={closeCart}
                  />
                )}
              </div>
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-mohasti-teal/10 bg-gray-50/50 px-4 py-5 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] sm:px-6 sm:py-6">
            <div className="mb-4 flex justify-between font-body text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold text-mohasti-teal-dark">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="mb-4 font-body text-xs leading-relaxed text-gray-600">
              Shipping and taxes calculated at checkout. Use code{" "}
              <strong className="text-mohasti-teal-dark">NEWSLETTER10</strong> for
              10% off.
            </p>
            <Link
              href="/cart"
              onClick={closeCart}
              className="mb-2 flex w-full items-center justify-center rounded-lg bg-mohasti-teal px-6 py-2.5 font-body text-sm font-medium text-white transition-colors hover:bg-mohasti-teal-dark"
            >
              View Cart
            </Link>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="flex w-full items-center justify-center rounded-lg bg-[#FFDE59] px-6 py-2.5 font-body text-sm font-semibold text-[#0f5c60] transition-opacity hover:opacity-90"
            >
              Checkout
            </Link>
            <button
              type="button"
              onClick={clearCart}
              className="mt-3 w-full text-center font-body text-xs text-gray-500 underline-offset-2 hover:text-mohasti-teal hover:underline"
            >
              Clear cart
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

function CartShippingProgress({
  remaining,
  progress,
  qualified,
}: {
  remaining: number;
  progress: number;
  qualified: boolean;
}) {
  return (
    <div className="rounded-xl border border-[#FFDE59]/40 bg-[#FFDE59]/15 px-4 py-3">
      {qualified ? (
        <p className="font-body text-xs font-medium text-[#0f5c60]">
          You unlocked <strong>free shipping</strong> on this order.
        </p>
      ) : (
        <p className="font-body text-xs text-mohasti-teal-dark">
          Add <strong>{formatPrice(remaining)}</strong> more for{" "}
          <strong>free shipping</strong>
        </p>
      )}
      <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-white/70">
        <div
          className="h-full rounded-full bg-[#FFDE59] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 font-body text-[11px] text-mohasti-teal/55">
        Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}
      </p>
    </div>
  );
}

function CartPerksStrip() {
  const perks = [
    {
      title: "Mindful packaging",
      detail: "Plastic-free, hand-wrapped",
    },
    {
      title: "First-order gift",
      detail: "Free mindfulness wallpaper",
    },
    {
      title: "Studio note",
      detail: "A handwritten touch inside",
    },
  ];

  return (
    <div>
      <p className="font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-mohasti-teal/50">
        The Mohasti experience
      </p>
      <ul className="mt-3 grid gap-2">
        {perks.map((perk) => (
          <li
            key={perk.title}
            className="flex items-start gap-3 rounded-lg border border-mohasti-teal/8 bg-white px-3 py-2.5"
          >
            <span
              className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#FFDE59] ring-2 ring-[#FFDE59]/30"
              aria-hidden
            />
            <span>
              <span className="block font-body text-xs font-semibold text-mohasti-teal-dark">
                {perk.title}
              </span>
              <span className="mt-0.5 block font-body text-[11px] text-mohasti-teal/60">
                {perk.detail}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CartRecommendations({
  products,
  onAdd,
  onClose,
}: {
  products: Product[];
  onAdd: (product: Product) => void;
  onClose: () => void;
}) {
  return (
    <section>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-mohasti-teal/50">
            You might also like
          </p>
          <h3 className="mt-1 font-display text-lg text-mohasti-teal-dark">
            Complete your ritual
          </h3>
        </div>
        <Link
          href="/collections/all"
          onClick={onClose}
          className="shrink-0 font-body text-xs font-medium text-mohasti-teal hover:text-mohasti-teal-dark"
        >
          Shop all
        </Link>
      </div>

      <div className="mt-3 -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-1 pb-1">
        {products.map((product) => (
          <article
            key={product.handle}
            className="w-[148px] shrink-0 snap-start overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
          >
            <Link
              href={`/products/${product.handle}`}
              onClick={onClose}
              className="block"
            >
              <ProductMedia
                product={product}
                className="aspect-square w-full"
              />
            </Link>
            <div className="p-2.5">
              <Link
                href={`/products/${product.handle}`}
                onClick={onClose}
                className="line-clamp-2 font-body text-[11px] font-medium leading-snug text-mohasti-teal-dark hover:text-mohasti-teal"
              >
                {product.title}
              </Link>
              <div className="mt-2 flex items-center justify-between gap-1">
                <span className="font-body text-xs font-semibold text-mohasti-teal-dark">
                  {formatPrice(product.price)}
                </span>
                <button
                  type="button"
                  onClick={() => onAdd(product)}
                  className="min-h-9 rounded-lg bg-[#FFDE59] px-3 py-2 font-body text-xs font-bold uppercase tracking-wide text-[#0f5c60] transition-opacity hover:opacity-90"
                >
                  Add
                </button>
              </div>
              {product.promoLabel && (
                <p className="mt-1 font-body text-[10px] font-medium text-mohasti-teal">
                  {product.promoLabel}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CartEmptyState({
  recommendations,
  onAdd,
  onClose,
}: {
  recommendations: Product[];
  onAdd: (product: Product) => void;
  onClose: () => void;
}) {
  const popular = recommendations.length > 0
    ? recommendations
    : getCartRecommendations([], 3);

  return (
    <div className="py-4">
      <div className="rounded-2xl border border-mohasti-teal/10 bg-gradient-to-br from-mohasti-teal/[0.04] to-[#FFDE59]/25 px-5 py-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-mohasti-teal/10">
          <Image
            src="/brand/mohasti-logo.svg"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 rounded-lg object-cover"
          />
        </div>
        <h3 className="font-display text-2xl text-mohasti-teal-dark">
          Your cart is waiting
        </h3>
        <p className="mt-2 font-body text-sm leading-relaxed text-mohasti-teal/70">
          Explore mindful art, postcards, and stationery crafted for slow rituals
          and quiet moments.
        </p>
        <Link
          href="/collections/all"
          onClick={onClose}
          className="mt-5 inline-flex rounded-lg bg-mohasti-teal px-6 py-2.5 font-body text-sm font-medium text-white transition-colors hover:bg-mohasti-teal-dark"
        >
          Browse collection
        </Link>
      </div>

      {popular.length > 0 && (
        <div className="mt-8">
          <p className="font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-mohasti-teal/50">
            Popular right now
          </p>
          <ul className="mt-3 space-y-3">
            {popular.map((product) => (
              <li
                key={product.handle}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                  <ProductMedia product={product} className="h-full w-full" />
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/products/${product.handle}`}
                    onClick={onClose}
                    className="line-clamp-2 font-body text-sm font-medium text-mohasti-teal-dark hover:text-mohasti-teal"
                  >
                    {product.title}
                  </Link>
                  <p className="mt-0.5 font-body text-xs text-gray-500">
                    {formatPrice(product.price)}
                    {product.promoLabel ? ` · ${product.promoLabel}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onAdd(product)}
                  className="shrink-0 rounded-lg bg-[#FFDE59] px-3 py-1.5 font-body text-xs font-bold text-[#0f5c60]"
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-2">
        {[
          { href: "/collections/postcards", label: "Postcards" },
          { href: "/collections/new-arrivals", label: "New arrivals" },
          { href: "/blogs/journal", label: "Journal" },
          { href: "/pages/about", label: "Our story" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="rounded-lg border border-mohasti-teal/10 px-3 py-2.5 text-center font-body text-xs font-medium text-mohasti-teal-dark transition-colors hover:border-mohasti-teal/25 hover:bg-mohasti-teal/[0.03]"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
