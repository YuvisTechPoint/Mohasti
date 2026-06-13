import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { InvoiceDocument } from "@/components/invoice/InvoiceDocument";
import { InvoiceToolbar } from "@/components/invoice/InvoiceToolbar";
import { getOrder } from "@/lib/orders";
import { canAccessOrder, isInvoiceViewable } from "@/lib/order-access";
import { getSessionUser } from "@/lib/firebase/session";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrder(orderId);
  return {
    title: order ? `Invoice ${order.invoiceNumber}` : "Invoice",
    description: order
      ? `GST tax invoice for Mohasti order ${order.id}`
      : undefined,
  };
}

export default async function InvoicePage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { orderId } = await params;
  const { token } = await searchParams;
  const order = await getOrder(orderId);

  if (!order || !isInvoiceViewable(order)) {
    notFound();
  }

  const sessionUser = await getSessionUser();
  if (
    !canAccessOrder(order, {
      accessToken: token,
      userId: sessionUser?.uid,
    })
  ) {
    notFound();
  }

  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const tokenQuery = token ? `?token=${encodeURIComponent(token)}` : "";
  const shareUrl = `${protocol}://${host}/orders/${order.id}/invoice${tokenQuery}`;

  return (
    <div className="invoice-page min-h-screen overflow-x-hidden bg-neutral-100 py-4 print:min-h-0 print:bg-white print:py-0 sm:py-8 md:py-12">
      <div className="mx-auto max-w-[210mm] px-3 sm:px-4 print:max-w-none print:px-0">
        <div className="invoice-no-print">
          <InvoiceToolbar order={order} invoiceUrl={shareUrl} />
          <p className="mt-3 text-center text-[11px] text-neutral-500 sm:mt-4">
            Use Print / PDF → Save as PDF
          </p>
        </div>
        <div className="border border-neutral-200 bg-white print:border-0">
          <InvoiceDocument order={order} />
        </div>
      </div>
    </div>
  );
}
