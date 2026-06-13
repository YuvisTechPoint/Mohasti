import Link from "next/link";
import { cn } from "@/lib/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
};

const variants = {
  primary:
    "bg-mohasti-teal text-white hover:bg-mohasti-cyan focus-visible:ring-mohasti-lotus-glow",
  secondary:
    "bg-mohasti-yellow text-mohasti-teal-dark hover:bg-mohasti-gold-light focus-visible:ring-mohasti-lotus-glow",
  outline:
    "border-2 border-mohasti-gold text-mohasti-teal-dark hover:bg-mohasti-gold hover:text-white focus-visible:ring-mohasti-lotus-glow",
  ghost:
    "text-mohasti-teal hover:text-mohasti-cyan hover:bg-mohasti-cyan/10 focus-visible:ring-mohasti-lotus-glow",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3 text-base",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  href,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
