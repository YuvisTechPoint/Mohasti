import { NextResponse } from "next/server";
import { validateCartItems, calculateTotals } from "@/lib/pricing";
import { resolveDiscountCode } from "@/lib/discounts";
import type { CartItem } from "@/types";

export async function POST(request: Request) {
  try {
    const { items, discountCode, state, giftWrap } = await request.json() as {
      items: CartItem[];
      discountCode?: string;
      state?: string;
      giftWrap?: boolean;
    };

    const { valid, errors } = validateCartItems(items ?? []);
    if (errors.length) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    let validatedDiscountCode: string | undefined;
    if (discountCode?.trim()) {
      const resolved = resolveDiscountCode(discountCode);
      if (!resolved.valid) {
        return NextResponse.json(
          { error: resolved.error ?? "Invalid discount code." },
          { status: 400 },
        );
      }
      validatedDiscountCode = resolved.code;
    }

    const totals = calculateTotals(
      valid,
      validatedDiscountCode,
      state ?? "Maharashtra",
      Boolean(giftWrap),
    );
    return NextResponse.json({ totals, itemCount: valid.length });
  } catch {
    return NextResponse.json(
      { error: "Failed to calculate totals." },
      { status: 500 },
    );
  }
}
