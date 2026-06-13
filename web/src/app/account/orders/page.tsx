import { redirect } from "next/navigation";
import { AccountOrdersList } from "@/components/account/AccountOrdersList";
import { getSessionUser } from "@/lib/firebase/session";

export const metadata = {
  title: "My Orders",
};

export default async function AccountOrdersPage() {
  const user = await getSessionUser();
  if (!user) redirect("/account/login");

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16">
      <h1 className="font-display text-3xl text-mohasti-teal md:text-4xl">
        My Orders
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        Live order updates — refreshes automatically when payment completes.
      </p>
      <div className="mt-8">
        <AccountOrdersList userId={user.uid} />
      </div>
    </div>
  );
}
