"use client";

import { useState } from "react";

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative bg-gradient-to-r from-mohasti-teal-dark via-[#145a5e] to-mohasti-teal-dark px-4 py-2.5 pr-10 text-center md:pr-4 print:hidden">
      <p className="font-body text-[11px] font-medium leading-snug tracking-wide text-white/90 sm:text-xs md:text-[13px]">
        <span className="hidden sm:inline">Shipping across India</span>
        <span className="mx-2 hidden text-mohasti-yellow/70 sm:inline" aria-hidden>
          ·
        </span>
        <span className="hidden md:inline">International orders via PayPal</span>
        <span className="mx-2 hidden text-mohasti-yellow/70 md:inline" aria-hidden>
          ·
        </span>
        <span>Free mindfulness wallpaper with first order</span>
      </p>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full font-body text-lg leading-none text-white/70 transition-colors hover:bg-white/10 hover:text-white md:hidden"
        aria-label="Dismiss announcement"
      >
        ×
      </button>
    </div>
  );
}
