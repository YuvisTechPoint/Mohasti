"use client";

import { useState, type ReactElement } from "react";
import { cn } from "@/lib/cn";

export type CheckoutPaymentMode = "online" | "cod";

type OnlineMethodId = "cards" | "upi" | "netbanking";

const ONLINE_METHODS: {
  id: OnlineMethodId;
  label: string;
  sub: string;
  providers: string[];
  Icon: () => ReactElement;
}[] = [
  {
    id: "cards",
    label: "Debit / Credit",
    sub: "Visa, Mastercard, RuPay",
    providers: ["Visa", "Mastercard", "RuPay"],
    Icon: CardIcon,
  },
  {
    id: "upi",
    label: "UPI",
    sub: "Instant bank transfer",
    providers: ["GPay", "PhonePe", "Paytm"],
    Icon: UpiIcon,
  },
  {
    id: "netbanking",
    label: "Net Banking",
    sub: "All major banks",
    providers: ["HDFC", "SBI", "ICICI", "Axis"],
    Icon: BankIcon,
  },
];

export function PaymentMethodOptions({
  mode,
  onModeChange,
}: {
  mode: CheckoutPaymentMode;
  onModeChange: (mode: CheckoutPaymentMode) => void;
}) {
  const [onlinePreference, setOnlinePreference] = useState<OnlineMethodId>("upi");

  return (
    <div className="space-y-5">
      <div
        className="grid gap-3 sm:grid-cols-2"
        role="radiogroup"
        aria-label="Checkout payment type"
      >
        <PaymentModeCard
          active={mode === "online"}
          title="Pay Online"
          description="UPI, cards, net banking via Razorpay"
          onSelect={() => onModeChange("online")}
          icon={<OnlinePayIcon />}
        />
        <PaymentModeCard
          active={mode === "cod"}
          title="Cash on Delivery"
          description="Pay in cash when your order arrives"
          onSelect={() => onModeChange("cod")}
          icon={<CodIcon />}
        />
      </div>

      {mode === "online" ? (
        <>
          <p className="text-sm text-gray-600">
            Pick your preferred online method — you can switch inside the secure
            payment window.
          </p>

          <div
            className="grid gap-3 sm:grid-cols-3"
            role="radiogroup"
            aria-label="Online payment method preference"
          >
            {ONLINE_METHODS.map(({ id, label, sub, providers, Icon }) => {
              const active = onlinePreference === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setOnlinePreference(id)}
                  className={cn(
                    "group relative flex flex-col rounded-xl border-2 p-4 text-left transition-all duration-200",
                    active
                      ? "border-mohasti-teal bg-gradient-to-br from-mohasti-cyan/10 via-white to-mohasti-teal/5 shadow-[0_4px_20px_-6px_rgba(26,138,143,0.25)]"
                      : "border-gray-200 bg-white hover:border-mohasti-cyan/40 hover:shadow-md",
                  )}
                >
                  {active && (
                    <span
                      className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-mohasti-teal text-white"
                      aria-hidden
                    >
                      <CheckIcon />
                    </span>
                  )}

                  <span
                    className={cn(
                      "mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl transition-colors",
                      active
                        ? "bg-mohasti-teal text-white shadow-sm"
                        : "bg-mohasti-cyan/10 text-mohasti-teal group-hover:bg-mohasti-cyan/15",
                    )}
                  >
                    <Icon />
                  </span>

                  <span className="font-semibold text-mohasti-teal-dark">
                    {label}
                  </span>
                  <span className="mt-0.5 text-xs text-gray-500">{sub}</span>

                  <span className="mt-3 flex flex-wrap gap-1">
                    {providers.map((p) => (
                      <span
                        key={p}
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                          active
                            ? "bg-mohasti-teal/10 text-mohasti-teal-dark"
                            : "bg-gray-100 text-gray-500",
                        )}
                      >
                        {p}
                      </span>
                    ))}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3">
            <span className="flex items-center gap-2 text-xs text-gray-600">
              <LockIcon />
              256-bit SSL · PCI-DSS compliant
            </span>
            <span className="text-xs font-medium text-mohasti-teal-dark">
              Powered by Razorpay
            </span>
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-[#FFDE59]/60 bg-[#FFDE59]/15 p-4 text-sm text-[#0f5c60]">
          <p className="font-medium">Pay when your order is delivered</p>
          <p className="mt-1.5 leading-relaxed text-[#0f5c60]/80">
            Keep the exact order amount ready in cash. Our delivery partner will
            collect payment at your doorstep.
          </p>
        </div>
      )}
    </div>
  );
}

function PaymentModeCard({
  active,
  title,
  description,
  icon,
  onSelect,
}: {
  active: boolean;
  title: string;
  description: string;
  icon: ReactElement;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onSelect}
      className={cn(
        "relative flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all duration-200",
        active
          ? "border-mohasti-teal bg-gradient-to-br from-mohasti-cyan/10 via-white to-mohasti-teal/5 shadow-[0_4px_20px_-6px_rgba(26,138,143,0.25)]"
          : "border-gray-200 bg-white hover:border-mohasti-cyan/40 hover:shadow-md",
      )}
    >
      {active && (
        <span
          className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-mohasti-teal text-white"
          aria-hidden
        >
          <CheckIcon />
        </span>
      )}
      <span
        className={cn(
          "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors",
          active
            ? "bg-mohasti-teal text-white shadow-sm"
            : "bg-mohasti-cyan/10 text-mohasti-teal",
        )}
      >
        {icon}
      </span>
      <span>
        <span className="block font-semibold text-mohasti-teal-dark">
          {title}
        </span>
        <span className="mt-0.5 block text-xs text-gray-500">{description}</span>
      </span>
    </button>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="text-mohasti-teal"
      aria-hidden
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function OnlinePayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
      <path d="M6 15h4" strokeLinecap="round" />
    </svg>
  );
}

function CodIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M7 10h4M7 14h2" strokeLinecap="round" />
      <circle cx="16" cy="14" r="2.5" />
      <path d="M12 6V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
      <path d="M6 15h4" strokeLinecap="round" />
    </svg>
  );
}

function UpiIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M7 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      <path d="M12 18h.01" strokeLinecap="round" strokeWidth="2.5" />
      <path d="M8 8h8M8 12h5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

function BankIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M3 21h18" />
      <path d="M3 10h18" />
      <path d="M5 10V7l7-4 7 4v3" />
      <path d="M9 21v-6h6v6" />
      <path d="M9 10v4M15 10v4" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}
