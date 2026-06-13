import type { Order, OrderLineItem, OrderTotals } from "@/types";

function lineTotal(item: OrderLineItem): number {
  if (item.lineTotal != null) return item.lineTotal;
  return (item.unitPrice ?? 0) * (item.quantity ?? 1);
}

export function getOrderGrandTotal(order: {
  items?: OrderLineItem[];
  totals?: Partial<OrderTotals>;
}): number {
  if (order.totals?.grandTotal != null) return order.totals.grandTotal;

  const subtotal = (order.items ?? []).reduce((sum, item) => sum + lineTotal(item), 0);
  const totals = order.totals;

  if (!totals) return subtotal;

  return (
    subtotal -
    (totals.discount ?? 0) +
    (totals.shipping ?? 0) +
    (totals.giftWrap ?? 0) +
    (totals.gstTotal ?? 0)
  );
}

function buildTotals(raw: Partial<Order>, items: OrderLineItem[]): OrderTotals {
  const subtotal = items.reduce((sum, item) => sum + lineTotal(item), 0);
  const existing = raw.totals;

  if (existing?.grandTotal != null) {
    return {
      subtotal: existing.subtotal ?? subtotal,
      discount: existing.discount ?? 0,
      discountCode: existing.discountCode,
      shipping: existing.shipping ?? 0,
      giftWrap: existing.giftWrap ?? 0,
      taxableAmount: existing.taxableAmount ?? subtotal,
      cgst: existing.cgst ?? 0,
      sgst: existing.sgst ?? 0,
      igst: existing.igst ?? 0,
      gstTotal: existing.gstTotal ?? 0,
      grandTotal: existing.grandTotal,
    };
  }

  return {
    subtotal: existing?.subtotal ?? subtotal,
    discount: existing?.discount ?? 0,
    discountCode: existing?.discountCode,
    shipping: existing?.shipping ?? 0,
    giftWrap: existing?.giftWrap ?? 0,
    taxableAmount: existing?.taxableAmount ?? subtotal,
    cgst: existing?.cgst ?? 0,
    sgst: existing?.sgst ?? 0,
    igst: existing?.igst ?? 0,
    gstTotal: existing?.gstTotal ?? 0,
    grandTotal: getOrderGrandTotal({ items, totals: existing }),
  };
}

/** Coerce partial Firestore / API payloads into a display-safe order. */
export function normalizeOrder(raw: unknown): Order | null {
  if (!raw || typeof raw !== "object") return null;

  const order = raw as Partial<Order>;
  if (!order.id || !order.createdAt) return null;

  const items = Array.isArray(order.items) ? order.items : [];
  const totals = buildTotals(order, items);

  return {
    id: order.id,
    invoiceNumber: order.invoiceNumber ?? order.id,
    shippingEmail: order.shippingEmail,
    userId: order.userId,
    status: order.status ?? "pending_payment",
    items,
    shipping: order.shipping ?? {
      fullName: "",
      email: order.shippingEmail ?? "",
      phone: "",
      addressLine1: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },
    totals,
    payment: order.payment ?? { method: "razorpay" },
    createdAt: order.createdAt,
    updatedAt: order.updatedAt ?? order.createdAt,
  };
}

export function normalizeOrders(rawOrders: unknown[]): Order[] {
  return rawOrders
    .map((order) => normalizeOrder(order))
    .filter((order): order is Order => order != null);
}
