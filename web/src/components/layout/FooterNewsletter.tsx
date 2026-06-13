"use client";

import { useEffect, useState } from "react";

export function FooterNewsletter() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

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
      setErrorMessage(
        err instanceof Error ? err.message : "Subscription failed.",
      );
    }
  }

  if (!mounted) {
    return (
      <div className="space-y-2" aria-hidden>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="min-h-[42px] min-w-0 flex-1 rounded-full border border-white/15 bg-white/10" />
          <div className="h-[42px] w-[7.5rem] shrink-0 rounded-lg bg-mohasti-cyan/40" />
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <p className="rounded-xl bg-white/10 px-4 py-3 text-sm text-white/90">
        Welcome! Use <strong className="text-mohasti-cyan">NEWSLETTER10</strong>{" "}
        for 10% off your first order.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          autoComplete="email"
          disabled={status === "loading"}
          className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-mohasti-cyan/50 focus:outline-none focus:ring-2 focus:ring-mohasti-cyan/20"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 rounded-lg bg-mohasti-cyan px-5 py-2.5 text-sm font-semibold text-mohasti-teal-dark transition-colors hover:bg-white disabled:opacity-60"
        >
          {status === "loading" ? "…" : "Subscribe"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-xs text-red-300">{errorMessage}</p>
      )}
    </form>
  );
}
