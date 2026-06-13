import type { ProductStatus } from "@/types";
import { cn } from "@/lib/cn";

const labels: Record<ProductStatus, string> = {
  available: "",
  sold_out: "Sold out",
  pre_order: "Pre-order",
  new: "New",
};

const styles: Record<ProductStatus, string> = {
  available: "",
  sold_out: "bg-gray-600 text-white",
  pre_order: "bg-mohasti-teal text-white",
  new: "bg-mohasti-yellow text-mohasti-teal-dark",
};

export function Badge({
  status,
  className,
}: {
  status: ProductStatus;
  className?: string;
}) {
  if (status === "available") return null;
  return (
    <span
      className={cn(
        "absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
        styles[status],
        className,
      )}
    >
      {labels[status]}
    </span>
  );
}
