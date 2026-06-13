"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Subscription failed.");
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Subscription failed.");
    }
  }

  return (
    <section className="newsletter-gradient relative overflow-hidden py-16 md:py-24">
      <div
        className="pointer-events-none absolute right-0 top-0 h-64 w-64 opacity-10"
        style={{
          background: "url(/decor/lotus-glow.svg) center/contain no-repeat",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-2xl px-4 text-center md:px-6">
        <h2 className="font-display text-3xl font-medium text-mohasti-teal md:text-4xl">
          Join the Mohasti Circle
        </h2>
        <p className="mt-4 leading-relaxed text-mohasti-teal-dark/90">
          Collection drops, studio notes, monthly phone &amp; laptop wallpapers,
          and gentle reminders to pause. Receive 10% off your first order.
        </p>

        {status === "success" ? (
          <div className="mt-8 rounded-xl bg-white/80 p-6 text-mohasti-teal-dark">
            <p className="font-medium">Welcome to the circle.</p>
            <p className="mt-2 text-sm">
              Use code <strong>NEWSLETTER10</strong> at checkout for 10% off.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              placeholder="Your email address"
              required
              suppressHydrationWarning
              autoComplete="email"
              disabled={status === "loading"}
              className="flex-1 rounded-full border border-gray-300 bg-white px-5 py-3 text-mohasti-teal-dark outline-none focus:ring-2 focus:ring-mohasti-lotus-glow disabled:opacity-60"
            />
            <Button type="submit" size="lg" className="shrink-0" disabled={status === "loading"}>
              {status === "loading" ? "Subscribing…" : "Subscribe"}
            </Button>
          </form>
        )}

        {status === "error" && (
          <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
        )}

        <p className="mt-4 text-xs text-gray-600">
          We respect your inbox. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
