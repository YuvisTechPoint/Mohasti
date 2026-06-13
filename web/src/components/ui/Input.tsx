import { cn } from "@/lib/cn";

export function Input({
  label,
  error,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-mohasti-teal-dark">
        {label}
        {props.required && <span className="text-mohasti-cyan"> *</span>}
      </label>
      <input
        {...props}
        className={cn(
          "w-full rounded-xl border bg-white px-4 py-3 text-mohasti-teal-dark shadow-sm transition-all",
          "placeholder:text-gray-400",
          "focus:border-mohasti-cyan focus:outline-none focus:ring-2 focus:ring-mohasti-lotus-glow/40",
          error ? "border-red-400" : "border-gray-200",
        )}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function Select({
  label,
  error,
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-mohasti-teal-dark">
        {label}
        {props.required && <span className="text-mohasti-cyan"> *</span>}
      </label>
      <select
        {...props}
        className={cn(
          "w-full rounded-xl border bg-white px-4 py-3 text-mohasti-teal-dark shadow-sm",
          "focus:border-mohasti-cyan focus:outline-none focus:ring-2 focus:ring-mohasti-lotus-glow/40",
          error ? "border-red-400" : "border-gray-200",
        )}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
