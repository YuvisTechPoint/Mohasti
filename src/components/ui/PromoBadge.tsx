import { cn } from "@/lib/cn";

export function PromoBadge({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-mohasti-yellow px-3 py-1 text-xs font-bold uppercase tracking-wide text-mohasti-teal-dark ring-1 ring-mohasti-gold/40",
        className,
      )}
    >
      {label}
    </span>
  );
}
