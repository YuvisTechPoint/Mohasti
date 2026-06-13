import type { CartItem, OrderLineItem, OrderTotals } from "@/types";
import { getProduct } from "@/lib/products";
import { DISCOUNT_CODES, normalizeDiscountCode } from "@/lib/discounts";

export const GST_RATE = 0.12;
export const SHIPPING_FLAT = 99;
export const FREE_SHIPPING_THRESHOLD = 1500;
export const GIFT_WRAP_FEE = 10;

export { DISCOUNT_CODES };

export type PricedLineItem = OrderLineItem;

export function validateCartItems(
  items: CartItem[],
): { valid: PricedLineItem[]; errors: string[] } {
  const errors: string[] = [];
  const valid: PricedLineItem[] = [];

  for (const item of items) {
    const product = getProduct(item.handle);
    if (!product) {
      errors.push(`Product "${item.title}" is no longer available.`);
      continue;
    }
    if (product.status === "sold_out") {
      errors.push(`"${product.title}" is sold out.`);
      continue;
    }
    if (item.quantity < 1 || item.quantity > 20) {
      errors.push(`Invalid quantity for "${product.title}".`);
      continue;
    }

    valid.push({
      handle: product.handle,
      title: product.title,
      quantity: item.quantity,
      unitPrice: product.price,
      lineTotal: product.price * item.quantity,
      hsnCode: product.hsnCode ?? "4820",
      imageGradient: product.imageGradient,
      ...(product.image ? { image: product.image } : {}),
    });
  }

  return { valid, errors };
}

export function calculateTotals(
  items: PricedLineItem[],
  discountCode?: string,
  customerState = "Maharashtra",
  giftWrap = false,
): OrderTotals {
  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
  const normalizedCode = discountCode
    ? normalizeDiscountCode(discountCode)
    : "";
  const discountRate = normalizedCode
    ? (DISCOUNT_CODES[normalizedCode] ?? 0)
    : 0;
  const discount = Math.round(subtotal * discountRate * 100) / 100;
  const afterDiscount = subtotal - discount;
  const shipping =
    afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const giftWrapFee = giftWrap ? GIFT_WRAP_FEE : 0;
  const preTaxTotal = afterDiscount + shipping + giftWrapFee;

  const taxableAmount =
    Math.round((preTaxTotal / (1 + GST_RATE)) * 100) / 100;
  const gstTotal = Math.round((preTaxTotal - taxableAmount) * 100) / 100;

  const isIntraState = customerState.toLowerCase() === "maharashtra";
  const cgst = isIntraState ? gstTotal / 2 : 0;
  const sgst = isIntraState ? gstTotal / 2 : 0;
  const igst = isIntraState ? 0 : gstTotal;

  return {
    subtotal,
    discount,
    discountCode: discountRate > 0 ? normalizedCode : undefined,
    shipping,
    giftWrap: giftWrapFee,
    taxableAmount,
    cgst: Math.round(cgst * 100) / 100,
    sgst: Math.round(sgst * 100) / 100,
    igst: Math.round(igst * 100) / 100,
    gstTotal,
    grandTotal: preTaxTotal,
  };
}
