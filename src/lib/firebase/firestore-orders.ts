import type { Order } from "@/types";
import { getAdminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { stripUndefined } from "@/lib/firebase/firestore-utils";

const ORDERS_COLLECTION = "orders";

export async function saveOrderToFirestore(order: Order): Promise<boolean> {
  const db = getAdminDb();
  if (!db || !isFirebaseAdminConfigured()) return false;

  await db
    .collection(ORDERS_COLLECTION)
    .doc(order.id)
    .set(stripUndefined(order), { merge: true });
  return true;
}

export async function getOrderFromFirestore(id: string): Promise<Order | null> {
  const db = getAdminDb();
  if (!db || !isFirebaseAdminConfigured()) return null;

  const snap = await db.collection(ORDERS_COLLECTION).doc(id).get();
  if (!snap.exists) return null;
  return snap.data() as Order;
}

export async function getOrdersByUserId(uid: string): Promise<Order[]> {
  const db = getAdminDb();
  if (!db || !isFirebaseAdminConfigured()) return [];

  const snap = await db
    .collection(ORDERS_COLLECTION)
    .where("userId", "==", uid)
    .limit(50)
    .get();

  return snap.docs
    .map((doc) => doc.data() as Order)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function attachUserToOrder(
  orderId: string,
  userId: string,
): Promise<void> {
  const db = getAdminDb();
  if (!db || !isFirebaseAdminConfigured()) return;

  await db.collection(ORDERS_COLLECTION).doc(orderId).set(
    { userId, updatedAt: new Date().toISOString() },
    { merge: true },
  );
}

export async function linkGuestOrdersByEmail(
  userId: string,
  email: string,
): Promise<number> {
  const db = getAdminDb();
  if (!db || !isFirebaseAdminConfigured()) return 0;

  const shippingEmail = email.trim().toLowerCase();
  if (!shippingEmail) return 0;

  const snap = await db
    .collection(ORDERS_COLLECTION)
    .where("shippingEmail", "==", shippingEmail)
    .limit(50)
    .get();

  if (snap.empty) return 0;

  const batch = db.batch();
  let linked = 0;

  for (const doc of snap.docs) {
    const data = doc.data() as Order;
    if (!data.userId) {
      batch.set(
        doc.ref,
        { userId, updatedAt: new Date().toISOString() },
        { merge: true },
      );
      linked += 1;
    }
  }

  if (linked > 0) await batch.commit();
  return linked;
}
