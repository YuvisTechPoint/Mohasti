import { cn } from "@/lib/cn";

const steps = [
  { id: 1, label: "Shipping" },
  { id: 2, label: "Payment" },
  { id: 3, label: "Confirm" },
];

export function CheckoutSteps({ current }: { current: number }) {
  return (
    <ol className="mb-8 flex items-center justify-center gap-1 sm:mb-10 sm:gap-2 md:gap-4">
      {steps.map((step, i) => (
        <li key={step.id} className="flex items-center gap-1 sm:gap-2 md:gap-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                current >= step.id
                  ? "bg-mohasti-teal text-white shadow-md shadow-mohasti-teal/30"
                  : "bg-gray-100 text-gray-500",
              )}
            >
              {step.id}
            </span>
            <span
              className={cn(
                "text-[11px] font-medium sm:text-sm",
                current >= step.id
                  ? "text-mohasti-teal-dark"
                  : "text-gray-500",
              )}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "h-px w-4 sm:w-8 md:w-16",
                current > step.id ? "bg-mohasti-cyan" : "bg-gray-200",
              )}
            />
          )}
        </li>
      ))}
    </ol>
  );
}
