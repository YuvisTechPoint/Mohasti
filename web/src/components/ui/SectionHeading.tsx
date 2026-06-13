import { cn } from "@/lib/cn";

export function SectionHeading({
  title,
  subtitle,
  className,
  align = "center",
}: {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "mb-10",
        align === "center" && "text-center",
        className,
      )}
    >
      <h2 className="font-display text-2xl font-medium text-mohasti-teal sm:text-3xl md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 max-w-2xl text-mohasti-teal-dark/80 mx-auto text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}
