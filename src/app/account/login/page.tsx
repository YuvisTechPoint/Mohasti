import { Suspense } from "react";
import { AccountLoginForm } from "@/components/auth/AccountLoginForm";

function LoginFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-mohasti-cyan border-t-transparent" />
    </div>
  );
}

export default function AccountLoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <AccountLoginForm />
    </Suspense>
  );
}
