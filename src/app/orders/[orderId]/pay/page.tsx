import { notFound, redirect } from "next/navigation";
import { ResumePaymentClient } from "@/components/orders/ResumePaymentClient";
import { getOrder } from "@/lib/orders";
import { canAccessOrder } from "@/lib/order-access";
import { getSessionUser } from "@/lib/firebase/session";
import { isDemoPaymentsAllowed } from "@/lib/env";
import { isRazorpayConfigured } from "@/lib/razorpay";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrder(orderId);
  return {
    title: order ? `Pay ${order.invoiceNumber}` : "Complete payment",
  };
}

export default async function ResumePaymentPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { orderId } = await params;
  const { token } = await searchParams;
  const order = await getOrder(orderId);

  if (!order) notFound();

  const sessionUser = await getSessionUser();
  if (
    !canAccessOrder(order, {
      accessToken: token,
      userId: sessionUser?.uid,
    })
  ) {
    notFound();
  }

  if (order.status === "paid" || order.status === "confirmed") {
    const tokenQuery = token ? `?token=${encodeURIComponent(token)}` : "";
    redirect(`/orders/${order.id}/success${tokenQuery}`);
  }

  if (order.status !== "pending_payment") {
    notFound();
  }

  const demoMode = !isRazorpayConfigured() && isDemoPaymentsAllowed();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <ResumePaymentClient
        order={order}
        accessToken={token}
        demoMode={demoMode}
      />
    </div>
  );
}
