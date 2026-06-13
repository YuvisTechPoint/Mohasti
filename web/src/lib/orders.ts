import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import type { Order, OrderStatus, ShippingAddress } from "@/types";
import type { PricedLineItem } from "@/lib/pricing";
import { calculateTotals } from "@/lib/pricing";
import {
  getOrderFromFirestore,
  getOrdersByUserId as getFirestoreOrdersByUserId,
  linkGuestOrdersByEmail,
  saveOrderToFirestore,
  attachUserToOrder,
} from "@/lib/firebase/firestore-orders";

const DATA_DIR = path.join(
  process.cwd(),
  "node_modules",
  ".cache",
  "mohasti-orders",
);
const isDev = process.env.NODE_ENV === "development";

async function ensureDir() {
  if (!isDev) return;
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function orderPath(id: string) {
  return path.join(DATA_DIR, `${id}.json`);
}

function randomSuffix(length = 4): string {
  return randomBytes(length).toString("hex").toUpperCase();
}

export function generateOrderId(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `MST${date}${randomSuffix(4)}`;
}

export function generateInvoiceNumber(orderId: string): string {
  const year = new Date().getFullYear();
  const seq = orderId.replace(/^MST/, "").slice(-8);
  return `INV/${year}/${seq}`;
}

function generateAccessToken(): string {
  return randomBytes(24).toString("hex");
}

function normalizeShipping(shipping: ShippingAddress): ShippingAddress {
  return {
    ...shipping,
    email: shipping.email.trim().toLowerCase(),
    fullName: shipping.fullName.trim(),
    phone: shipping.phone.trim(),
    addressLine1: shipping.addressLine1.trim(),
    city: shipping.city.trim(),
    pincode: shipping.pincode.trim(),
  };
}

export async function saveOrder(order: Order): Promise<void> {
  const savedToFirestore = await saveOrderToFirestore(order);

  if (isDev) {
    await ensureDir();
    await fs.writeFile(orderPath(order.id), JSON.stringify(order, null, 2));
    return;
  }

  if (!savedToFirestore) {
    throw new Error(
      "Order storage is not configured. Set Firebase Admin credentials.",
    );
  }
}

export async function getOrder(id: string): Promise<Order | null> {
  const fromFirestore = await getOrderFromFirestore(id);
  if (fromFirestore) return fromFirestore;

  if (!isDev) return null;

  try {
    const raw = await fs.readFile(orderPath(id), "utf-8");
    return JSON.parse(raw) as Order;
  } catch {
    return null;
  }
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  paymentUpdate?: Partial<Order["payment"]>,
): Promise<Order | null> {
  const order = await getOrder(id);
  if (!order) return null;

  order.status = status;
  order.updatedAt = new Date().toISOString();
  if (paymentUpdate) {
    order.payment = { ...order.payment, ...paymentUpdate };
  }

  await saveOrder(order);
  return order;
}

export async function createOrder(
  items: PricedLineItem[],
  shipping: ShippingAddress,
  discountCode?: string,
  userId?: string,
  giftWrap = false,
  paymentMethod: "online" | "cod" = "online",
): Promise<Order> {
  const id = generateOrderId();
  const now = new Date().toISOString();
  const normalizedShipping = normalizeShipping(shipping);
  const totals = calculateTotals(
    items,
    discountCode,
    normalizedShipping.state,
    giftWrap,
  );
  const isCod = paymentMethod === "cod";

  const order: Order = {
    id,
    invoiceNumber: generateInvoiceNumber(id),
    accessToken: generateAccessToken(),
    shippingEmail: normalizedShipping.email,
    ...(userId ? { userId } : {}),
    status: isCod ? "confirmed" : "pending_payment",
    items,
    shipping: normalizedShipping,
    totals,
    payment: { method: isCod ? "cod" : "razorpay" },
    createdAt: now,
    updatedAt: now,
  };

  await saveOrder(order);
  return order;
}

export async function linkGuestOrdersToUser(
  userId: string,
  email: string,
): Promise<number> {
  return linkGuestOrdersByEmail(userId, email);
}

export async function getOrdersByUserId(uid: string): Promise<Order[]> {
  const fromFirestore = await getFirestoreOrdersByUserId(uid);
  if (fromFirestore.length > 0) return fromFirestore;

  if (isDev) {
    return getOrdersByUserIdFromLocal(uid);
  }

  return [];
}

async function getOrdersByUserIdFromLocal(uid: string): Promise<Order[]> {
  try {
    await ensureDir();
    const files = await fs.readdir(DATA_DIR);
    const orders: Order[] = [];

    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      try {
        const raw = await fs.readFile(path.join(DATA_DIR, file), "utf-8");
        const order = JSON.parse(raw) as Order;
        if (order.userId === uid) orders.push(order);
      } catch {
        // skip invalid files
      }
    }

    return orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}

export async function linkOrderToUser(
  orderId: string,
  userId: string,
): Promise<void> {
  const order = await getOrder(orderId);
  if (!order || order.userId) return;

  await attachUserToOrder(orderId, userId);

  if (isDev) {
    order.userId = userId;
    order.updatedAt = new Date().toISOString();
    await ensureDir();
    await fs.writeFile(orderPath(orderId), JSON.stringify(order, null, 2));
  }
}
