import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_MS } from "@/lib/firebase/constants";

export { SESSION_COOKIE_NAME, SESSION_MAX_AGE_MS };

export function isFirebaseAdminConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY,
  );
}

export function getAdminApp(): App | null {
  if (!isFirebaseAdminConfigured()) return null;

  if (getApps().length) return getApps()[0]!;

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    }),
  });
}

export function getAdminAuth() {
  const app = getAdminApp();
  if (!app) return null;
  return getAuth(app);
}

let cachedDb: Firestore | null = null;

export function getAdminDb(): Firestore | null {
  if (cachedDb) return cachedDb;

  const app = getAdminApp();
  if (!app) return null;

  const db = getFirestore(app);
  try {
    db.settings({ ignoreUndefinedProperties: true });
  } catch {
    // Firestore may already be initialized (dev HMR or prior use).
  }

  cachedDb = db;
  return db;
}
