"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          subject: formData.get("subject"),
          message: formData.get("message"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to send message.");
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Failed to send message.");
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6 md:py-24">
      <h1 className="font-display text-4xl font-medium text-mohasti-teal">
        Contact
      </h1>
      <p className="mt-4 text-mohasti-teal-dark/90">
        We&apos;d love to hear from you. Whether it&apos;s about an order, a
        collaboration, or simply hello — reach out.
      </p>

      <div className="mt-6 space-y-2 text-sm">
        <p>
          <strong>Email:</strong>{" "}
          <a
            href="mailto:hello@mohasti.com"
            className="text-mohasti-teal hover:text-mohasti-cyan"
          >
            hello@mohasti.com
          </a>
        </p>
        <p>
          <strong>Instagram:</strong>{" "}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-mohasti-teal hover:text-mohasti-cyan"
          >
            @mohasti
          </a>
        </p>
        <p className="text-gray-600">We reply within 2–3 business days.</p>
      </div>

      {status === "success" ? (
        <div className="mt-10 rounded-xl border border-gray-300 bg-white p-8 text-center">
          <p className="font-medium text-mohasti-teal">Message sent.</p>
          <p className="mt-2 text-sm text-gray-600">
            Thank you for reaching out. We&apos;ll get back to you soon.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              name="name"
              required
              disabled={status === "loading"}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-mohasti-lotus-glow disabled:opacity-60"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              disabled={status === "loading"}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-mohasti-lotus-glow disabled:opacity-60"
            />
          </div>
          <div>
            <label htmlFor="subject" className="mb-1 block text-sm font-medium">
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              required
              disabled={status === "loading"}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-mohasti-lotus-glow disabled:opacity-60"
            />
          </div>
          <div>
            <label htmlFor="message" className="mb-1 block text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              disabled={status === "loading"}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-mohasti-lotus-glow disabled:opacity-60"
            />
          </div>
          {status === "error" && (
            <p className="text-sm text-red-600">{errorMessage}</p>
          )}
          <Button type="submit" size="lg" disabled={status === "loading"}>
            {status === "loading" ? "Sending…" : "Send Message"}
          </Button>
        </form>
      )}
    </div>
  );
}
