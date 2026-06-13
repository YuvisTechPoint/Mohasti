import Image from "next/image";
import type { ComponentType } from "react";
import { cn } from "@/lib/cn";

const iconClass = "h-[26px] w-auto origin-center scale-110";

/** Mastercard overlapping circles — kept as vector for crisp display */
export function MastercardIcon({ className = iconClass }: { className?: string }) {
  return (
    <svg viewBox="0 0 34 22" className={className} aria-hidden>
      <circle cx="13" cy="11" r="7.5" fill="#EB001B" />
      <circle cx="21" cy="11" r="7.5" fill="#F79E1B" />
      <path
        fill="#FF5F00"
        d="M17 5.8a7.5 7.5 0 0 0-2.9 6.2 7.5 7.5 0 0 0 2.9 6.2 7.5 7.5 0 0 0 2.9-6.2 7.5 7.5 0 0 0-2.9-6.2Z"
      />
    </svg>
  );
}

type PaymentMethod = {
  id: string;
  label: string;
  src?: string;
  imageClassName?: string;
  Icon?: ComponentType<{ className?: string }>;
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "upi",
    label: "UPI",
    src: "/images/payments/upi.avif",
    imageClassName:
      "h-[28px] w-auto max-w-none origin-center scale-[1.35] object-contain object-center",
  },
  {
    id: "visa",
    label: "Visa",
    src: "/images/payments/visa-grey.jpg",
    imageClassName:
      "h-[28px] w-auto max-w-none origin-center scale-[1.45] object-contain object-center",
  },
  {
    id: "mastercard",
    label: "Mastercard",
    Icon: MastercardIcon,
  },
  {
    id: "paypal",
    label: "PayPal",
    src: "/images/payments/paypal.png",
    imageClassName:
      "h-[28px] w-auto max-w-none origin-center scale-[1.3] object-contain object-center",
  },
];

export function PaymentMethodBadge({
  method,
}: {
  method: PaymentMethod;
}) {
  if (method.src) {
    return (
      <span className="flex h-full w-full items-center justify-center overflow-hidden">
        <Image
          src={method.src}
          alt=""
          width={120}
          height={32}
          className={cn(method.imageClassName, "shrink-0")}
          aria-hidden
        />
      </span>
    );
  }

  const Icon = method.Icon;
  return Icon ? (
    <span className="flex h-full w-full items-center justify-center overflow-hidden">
      <Icon />
    </span>
  ) : null;
}
