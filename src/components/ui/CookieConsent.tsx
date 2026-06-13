"use client";

import { useSyncExternalStore } from "react";
import { Button } from "./Button";

const CONSENT_KEY = "mohasti-cookie-consent";
const listeners = new Set<() => void>();

function subscribeConsent(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getConsentSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(CONSENT_KEY) === null;
}

function getServerConsentSnapshot(): boolean {
  return false;
}

function acceptConsent() {
  localStorage.setItem(CONSENT_KEY, "true");
  listeners.forEach((cb) => cb());
}

export function CookieConsent() {
  const visible = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getServerConsentSnapshot,
  );

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-lg rounded-xl border border-gray-300 bg-white p-4 shadow-lg pb-[calc(1rem+env(safe-area-inset-bottom,0px))] md:left-6 md:right-auto print:hidden">
      <p className="text-sm text-mohasti-teal-dark">
        We use cookies to improve your experience. By continuing, you agree to
        our{" "}
        <a href="/policies/privacy" className="text-mohasti-teal underline">
          privacy policy
        </a>
        .
      </p>
      <div className="mt-3 flex gap-2">
        <Button size="sm" onClick={acceptConsent}>
          Accept
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            localStorage.setItem(CONSENT_KEY, "dismissed");
            listeners.forEach((cb) => cb());
          }}
        >
          Dismiss
        </Button>
      </div>
    </div>
  );
}
