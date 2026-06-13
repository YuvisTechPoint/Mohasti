import { NextResponse } from "next/server";
import { getOrder } from "@/lib/orders";
import { canAccessOrder, sanitizeOrder } from "@/lib/order-access";
import { getSessionUser } from "@/lib/firebase/session";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;
  const order = await getOrder(orderId);

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const accessToken = searchParams.get("token");
  const sessionUser = await getSessionUser();

  if (
    !canAccessOrder(order, {
      accessToken,
      userId: sessionUser?.uid,
    })
  ) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
  }

  return NextResponse.json({ order: sanitizeOrder(order) });
}
