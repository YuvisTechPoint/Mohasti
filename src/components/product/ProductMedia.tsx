"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/types";
import { cn } from "@/lib/cn";

export function ProductMedia({
  product,
  className,
  imageClassName,
  priority = false,
}: {
  product: Pick<Product, "title" | "image" | "imageGradient">;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  if (product.image && !imageFailed) {
    return (
      <div className={cn("relative h-full w-full overflow-hidden", className)}>
        <Image
          src={product.image}
          alt={product.title}
          fill
          priority={priority}
          className={cn("object-cover object-center", imageClassName)}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onError={() => setImageFailed(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={cn("h-full w-full", className)}
      style={{ background: product.imageGradient }}
      aria-hidden={!product.image || imageFailed}
      role={product.image && imageFailed ? "img" : undefined}
      aria-label={product.image && imageFailed ? product.title : undefined}
    />
  );
}
