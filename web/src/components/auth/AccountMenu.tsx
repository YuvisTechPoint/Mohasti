"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { cn } from "@/lib/cn";

export function AccountMenu() {
  const { user, loading, openAuth, signOutUser, configured } = useAuth();
  const [open, setOpen] = useState(false);

  if (!configured) {
    return (
      <button
        type="button"
        className="site-header-icon-btn opacity-40"
        aria-label="Account unavailable"
        disabled
      >
        <UserIcon />
      </button>
    );
  }

  if (loading) {
    return (
      <span
        className="inline-block size-10 shrink-0 animate-pulse rounded-full bg-gray-100"
        aria-hidden
      />
    );
  }

  if (!user) {
    return (
      <button
        type="button"
        onClick={openAuth}
        className="site-header-icon-btn"
        aria-label="Sign in"
      >
        <UserIcon />
      </button>
    );
  }

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="site-header-icon-btn overflow-hidden bg-mohasti-teal/10 p-0 text-xs font-bold text-white hover:bg-mohasti-teal/15"
        aria-label="Account menu"
        aria-expanded={open}
      >
        {user.photoURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.photoURL}
            alt=""
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          (user.displayName?.[0] ?? user.email?.[0] ?? "M").toUpperCase()
        )}
      </button>
      <div
        className={cn(
          "absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-gray-200 bg-white py-2 shadow-lg",
          open ? "block" : "hidden",
        )}
      >
        <p className="truncate px-4 py-2 text-xs text-gray-500">{user.email}</p>
        <Link
          href="/account"
          className="block px-4 py-2 text-sm text-mohasti-teal-dark hover:bg-gray-50"
          onClick={() => setOpen(false)}
        >
          My Account
        </Link>
        <Link
          href="/account/orders"
          className="block px-4 py-2 text-sm text-mohasti-teal-dark hover:bg-gray-50"
          onClick={() => setOpen(false)}
        >
          My Orders
        </Link>
        <button
          type="button"
          className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
          onClick={() => {
            setOpen(false);
            signOutUser();
          }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
