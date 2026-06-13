import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readdir, unlink, rmdir } from "fs/promises";
import { join } from "path";

const ORDERS_COLLECTION = "orders";
const LOCAL_ORDERS_DIR = join(process.cwd(), "node_modules", ".cache", "mohasti-orders");

function initFirebase() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  if (!getApps().length) {
    initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });
  }

  return getFirestore();
}

async function deleteFirestoreOrders(db) {
  const snap = await db.collection(ORDERS_COLLECTION).get();
  if (snap.empty) {
    console.log("Firestore: no orders found.");
    return 0;
  }

  let deleted = 0;
  const docs = snap.docs;

  for (let i = 0; i < docs.length; i += 500) {
    const batch = db.batch();
    const chunk = docs.slice(i, i + 500);
    for (const doc of chunk) {
      batch.delete(doc.ref);
    }
    await batch.commit();
    deleted += chunk.length;
  }

  console.log(`Firestore: deleted ${deleted} order(s).`);
  return deleted;
}

async function deleteLocalOrders() {
  let deleted = 0;

  try {
    const files = await readdir(LOCAL_ORDERS_DIR);
    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      await unlink(join(LOCAL_ORDERS_DIR, file));
      deleted += 1;
    }

    if (deleted > 0) {
      try {
        await rmdir(LOCAL_ORDERS_DIR);
      } catch {
        // directory may not be empty or may not exist
      }
    }
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === "ENOENT") {
      console.log("Local .data/orders: no files found.");
      return 0;
    }
    throw err;
  }

  console.log(`Local .data/orders: deleted ${deleted} file(s).`);
  return deleted;
}

async function main() {
  const db = initFirebase();
  let total = 0;

  if (db) {
    total += await deleteFirestoreOrders(db);
  } else {
    console.log("Firestore: skipped (Firebase Admin not configured).");
  }

  total += await deleteLocalOrders();
  console.log(`Done. Removed ${total} order record(s) total.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
