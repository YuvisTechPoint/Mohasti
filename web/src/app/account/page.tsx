import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { AccountOrdersList } from "@/components/account/AccountOrdersList";
import { getSessionUser } from "@/lib/firebase/session";

export const metadata = {
  title: "My Account",
  description: "Manage your Mohasti account and orders.",
};

export default async function AccountPage() {
  const user = await getSessionUser();
  if (!user) redirect("/account/login");

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16">
      <h1 className="font-display text-3xl text-mohasti-teal md:text-4xl">
        My Account
      </h1>
      <p className="mt-2 text-gray-600">
        Signed in as <strong>{user.email}</strong>
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <Link href="/account/orders" className="card-elevated p-6 hover:shadow-[var(--shadow-card)]">
          <h2 className="font-semibold text-mohasti-teal-dark">Orders</h2>
          <p className="mt-2 text-sm text-gray-600">View order history &amp; invoices</p>
        </Link>
        <Link href="/collections/all" className="card-elevated p-6 hover:shadow-[var(--shadow-card)]">
          <h2 className="font-semibold text-mohasti-teal-dark">Shop</h2>
          <p className="mt-2 text-sm text-gray-600">Browse the collection</p>
        </Link>
        <div className="card-elevated p-6">
          <h2 className="font-semibold text-mohasti-teal-dark">Support</h2>
          <p className="mt-2 text-sm text-gray-600">
            <a href="mailto:hello@mohasti.com" className="text-mohasti-teal underline">
              hello@mohasti.com
            </a>
          </p>
        </div>
      </div>

      <section className="mt-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl text-mohasti-teal">Recent Orders</h2>
          <Button href="/account/orders" variant="outline" size="sm">
            View all
          </Button>
        </div>
        <AccountOrdersList userId={user.uid} limit={5} />
      </section>
    </div>
  );
}
