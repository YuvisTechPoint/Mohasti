import { NextResponse } from "next/server";
import { getOrdersByUserId } from "@/lib/orders";
import { getSessionUser } from "@/lib/firebase/session";
import { normalizeOrders } from "@/lib/order-normalize";
import { sanitizeOrder } from "@/lib/order-access";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const orders = normalizeOrders(await getOrdersByUserId(user.uid)).map(
    sanitizeOrder,
  );
  return NextResponse.json({ orders });
}
