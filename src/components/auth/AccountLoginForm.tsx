"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { useAuth } from "@/components/providers/AuthProvider";

export function AccountLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/account";
  const { user, loading, openAuth, signInWithGoogle, configured } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user) {
      router.replace(nextPath.startsWith("/") ? nextPath : "/account");
    }
  }, [loading, user, router, nextPath]);

  async function handleGoogle() {
    setGoogleLoading(true);
    setError("");
    try {
      await signInWithGoogle();
      router.replace(nextPath.startsWith("/") ? nextPath : "/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
    } finally {
      setGoogleLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-mohasti-cyan border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center md:py-28">
      <h1 className="font-display text-3xl text-mohasti-teal">Sign in</h1>
      <p className="mt-3 text-gray-600">
        Access your orders, invoices, and saved checkout details.
      </p>
      {configured ? (
        <div className="mt-8 space-y-3">
          <GoogleSignInButton
            onClick={handleGoogle}
            disabled={googleLoading}
            label={googleLoading ? "Connecting…" : "Continue with Google"}
          />
          <Button
            variant="ghost"
            className="w-full border border-gray-200"
            size="lg"
            onClick={openAuth}
          >
            Sign in with email
          </Button>
          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
          )}
        </div>
      ) : (
        <p className="mt-8 text-sm text-amber-700">
          Firebase is not configured. Add env variables and restart the server.
        </p>
      )}
      <Link
        href="/collections/all"
        className="mt-6 inline-block text-sm text-mohasti-teal hover:text-mohasti-cyan"
      >
        Continue shopping →
      </Link>
    </div>
  );
}
