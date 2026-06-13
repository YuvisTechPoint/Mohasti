"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { AccountMenu } from "@/components/auth/AccountMenu";
import { HeaderSearch } from "@/components/layout/HeaderSearch";
import { cn } from "@/lib/cn";

const navLinks = [
  { href: "/collections/all", label: "Shop" },
  { href: "/collections/new-arrivals", label: "Collections" },
  { href: "/pages/about", label: "About" },
  { href: "/blogs/journal", label: "Journal" },
  { href: "/pages/contact", label: "Contact" },
  { href: "/account/orders", label: "Order" },
] as const;

function isNavActive(href: string, pathname: string) {
  if (href === "/collections/all") {
    return (
      pathname === "/collections/all" ||
      pathname.startsWith("/products/") ||
      pathname.startsWith("/search")
    );
  }
  if (href === "/collections/new-arrivals") {
    return (
      pathname.startsWith("/collections/") &&
      pathname !== "/collections/all"
    );
  }
  if (href === "/account/orders") {
    return pathname === "/account/orders" || pathname.startsWith("/orders/");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const { itemCount, openCart, isHydrated } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="site-header glass-header sticky top-0 z-40 print:hidden">
      <div className="site-header-accent" aria-hidden />

      <div className="mx-auto grid min-w-0 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 px-4 py-3 sm:gap-x-4 lg:grid-cols-[1fr_auto_1fr] lg:px-6 lg:py-4">
        <Link
          href="/"
          className="site-header-brand group flex min-w-0 items-center gap-2 sm:gap-3 justify-self-start"
          aria-label="Mohasti — home"
        >
          <Image
            src="/brand/mohasti-logo.svg"
            alt=""
            width={40}
            height={50}
            className="h-9 w-auto shrink-0 rounded-xl object-cover object-top shadow-sm ring-1 ring-mohasti-teal/10 transition-all duration-300 group-hover:shadow-md group-hover:ring-mohasti-teal/20 sm:h-10"
            priority
          />
          <div className="min-w-0 leading-none">
            <span className="block truncate font-display text-lg font-semibold tracking-tight text-mohasti-teal-dark transition-colors duration-300 group-hover:text-mohasti-teal sm:text-xl lg:text-[1.65rem]">
              Mohasti
            </span>
            <span className="mt-1 hidden font-body text-[10px] font-medium uppercase tracking-[0.22em] text-mohasti-teal/55 sm:block">
              Art &amp; Stationery
            </span>
          </div>
        </Link>

        <nav
          className="hidden items-center justify-center gap-0.5 lg:flex xl:gap-1"
          aria-label="Main"
        >
          {navLinks.map((link) => (
            <HeaderNavLink
              key={link.href}
              href={link.href}
              label={link.label}
              active={isNavActive(link.href, pathname)}
            />
          ))}
        </nav>

        <div className="site-header-actions justify-end justify-self-end">
          <HeaderSearch />
          <AccountMenu />
          <button
            type="button"
            onClick={openCart}
            className="site-header-icon-btn relative"
            aria-label={`Cart, ${itemCount} items`}
          >
            <CartIcon />
            {isHydrated && itemCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-gradient-to-br from-[#fff4b8] via-[#FFDE59] to-[#f0cc3a] px-1 text-[10px] font-bold leading-none text-[#0f5c60] shadow-sm ring-2 ring-white">
                {itemCount}
              </span>
            )}
          </button>
          <button
            type="button"
            className="site-header-menu-toggle site-header-icon-btn lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "site-header-mobile border-t border-mohasti-teal/8 bg-white/95 lg:hidden",
          menuOpen ? "block" : "hidden",
        )}
      >
        <nav className="mx-auto flex max-w-7xl flex-col px-4 py-2 md:px-6" aria-label="Mobile">
          <MobileSearchField onNavigate={() => setMenuOpen(false)} />
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "site-header-mobile-link font-body text-[15px] font-medium tracking-wide",
                isNavActive(link.href, pathname)
                  ? "text-mohasti-teal-dark"
                  : "text-mohasti-teal-dark/75",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

function HeaderNavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "site-header-nav-link font-body text-[12px] font-medium tracking-[0.03em] xl:text-[13px] xl:tracking-[0.04em]",
        active && "site-header-nav-link--active",
      )}
    >
      {label}
    </Link>
  );
}

function MobileSearchField({ onNavigate }: { onNavigate: () => void }) {
  return (
    <form
      action="/search"
      method="GET"
      className="mb-2 flex gap-2 border-b border-mohasti-teal/8 pb-4"
      onSubmit={onNavigate}
    >
      <input
        name="q"
        type="search"
        placeholder="Search..."
        className="min-w-0 flex-1 rounded-full border border-gray-200 px-4 py-2.5 font-body text-base outline-none focus:border-mohasti-teal focus:ring-2 focus:ring-[#FFDE59]/40"
      />
      <button
        type="submit"
        className="shrink-0 rounded-lg bg-[#FFDE59] px-4 py-2.5 font-body text-sm font-semibold text-[#0f5c60] min-h-11"
      >
        Go
      </button>
    </form>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
