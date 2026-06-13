import Image from "next/image";
import Link from "next/link";
import { FooterNewsletter } from "@/components/layout/FooterNewsletter";
import { PAYMENT_METHODS, PaymentMethodBadge } from "@/components/layout/PaymentMethodIcons";

const shopLinks = [
  { href: "/collections/all", label: "All Products" },
  { href: "/collections/postcards", label: "Postcards" },
  { href: "/collections/greeting-cards", label: "Greeting Cards" },
  { href: "/collections/notebooks", label: "Journals & Notebooks" },
  { href: "/collections/new-arrivals", label: "New Arrivals" },
];

const helpLinks = [
  { href: "/pages/about", label: "About" },
  { href: "/pages/contact", label: "Contact" },
  { href: "/blogs/journal", label: "Journal" },
  { href: "/policies/shipping", label: "Shipping" },
  { href: "/policies/refund", label: "Refunds" },
  { href: "/policies/privacy", label: "Privacy" },
];

const socialLinks = [
  {
    href: "https://instagram.com",
    label: "Instagram",
    icon: InstagramIcon,
  },
  {
    href: "https://pinterest.com",
    label: "Pinterest",
    icon: PinterestIcon,
  },
];

export function Footer() {
  return (
    <footer className="border-t border-mohasti-teal/10 bg-mohasti-teal-dark text-white/90 print:hidden">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="group inline-flex items-center gap-3"
              aria-label="Mohasti — home"
            >
              <Image
                src="/brand/mohasti-logo.svg"
                alt=""
                width={44}
                height={55}
                className="h-11 w-11 rounded-lg object-cover object-top ring-1 ring-white/20 transition-shadow group-hover:ring-white/40"
              />
              <span className="font-display text-2xl font-semibold text-white transition-colors group-hover:text-mohasti-cyan">
                Mohasti
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
              Spiritual art and mindful stationery for everyday rituals — postcards,
              journals, and keepsakes crafted with care.
            </p>
            <ul className="mt-6 flex items-center gap-3">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-colors hover:border-mohasti-cyan/40 hover:bg-white/10 hover:text-mohasti-cyan"
                  >
                    <Icon />
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="mailto:hello@mohasti.com"
                  aria-label="Email hello@mohasti.com"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-colors hover:border-mohasti-cyan/40 hover:bg-white/10 hover:text-mohasti-cyan"
                >
                  <MailIcon />
                </a>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-4">
            <div>
              <h3 className="font-accent text-xs font-semibold uppercase tracking-[0.2em] text-mohasti-cyan">
                Shop
              </h3>
              <ul className="mt-4 space-y-2.5">
                {shopLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/75 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-accent text-xs font-semibold uppercase tracking-[0.2em] text-mohasti-cyan">
                Help
              </h3>
              <ul className="mt-4 space-y-2.5">
                {helpLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/75 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4">
            <h3 className="font-accent text-xs font-semibold uppercase tracking-[0.2em] text-mohasti-cyan">
              Stay in the loop
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Studio drops, journal notes, and 10% off your first order with code{" "}
              <span className="font-medium text-white">NEWSLETTER10</span>.
            </p>
            <div className="mt-5">
              <FooterNewsletter />
            </div>
            <ul className="mt-6 space-y-2 text-xs text-white/55">
              <li className="flex items-center gap-2">
                <TrustDot />
                Free shipping on orders over ₹ 1,500
              </li>
              <li className="flex items-center gap-2">
                <TrustDot />
                Secure UPI, cards &amp; net banking
              </li>
              <li className="flex items-center gap-2">
                <TrustDot />
                GST invoice on every order
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 bg-black/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row md:px-6">
          <p className="text-center text-xs text-white/50 md:text-left">
            © {new Date().getFullYear()} Mohasti. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {PAYMENT_METHODS.map((method) => (
              <span
                key={method.id}
                title={method.label}
                aria-label={method.label}
                className="flex h-7 min-w-[2.75rem] items-center justify-center overflow-hidden rounded-md border border-white/15 bg-white px-2 shadow-sm sm:h-8 sm:min-w-[3rem] sm:px-2.5"
              >
                <PaymentMethodBadge method={method} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function TrustDot() {
  return (
    <span
      className="h-1 w-1 shrink-0 rounded-full bg-mohasti-cyan/80"
      aria-hidden
    />
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PinterestIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.12 2.51 7.63 6.08 9.13-.08-.74-.02-1.63.2-2.43l1.4-5.93s-.35-.7-.35-1.74c0-1.63.94-2.85 2.12-2.85 1 0 1.48.75 1.48 1.65 0 1-.64 2.5-.97 3.88-.28 1.16.58 2.1 1.72 2.1 2.07 0 3.66-2.18 3.66-5.33 0-2.79-2-4.74-4.86-4.74-3.31 0-5.25 2.48-5.25 5.04 0 1 .38 2.08 1.54 2.44.17.06.32 0 .37-.12l.35-1.4c.04-.17.03-.23-.1-.35-.28-.35-.46-.8-.46-1.44 0-1.85 1.34-3.55 3.52-3.55 1.85 0 3.28 1.42 3.28 3.51 0 1.84-1.16 3.32-2.77 3.32-.54 0-1.05-.28-1.22-.62 0 0-.27 1.03-.33 1.28-.12.46-.44 1.04-.65 1.39.49.15 1.01.23 1.55.23 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 7 10-7" />
    </svg>
  );
}
