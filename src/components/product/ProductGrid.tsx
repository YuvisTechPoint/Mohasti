"use client";

import type { Product } from "@/types";
import { useCart } from "@/components/providers/CartProvider";
import { ProductCard } from "@/components/product/ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  const { addItem } = useCart();

  return (
    <div className="grid grid-cols-2 items-stretch gap-3 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6">
      {products.map((product) => (
        <div key={product.handle} className="min-h-0 w-full">
          <ProductCard product={product} onAdd={addItem} />
        </div>
      ))}
    </div>
  );
}
