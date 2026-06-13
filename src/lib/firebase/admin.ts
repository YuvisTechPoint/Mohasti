import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_MS,
} from "@/lib/firebase/constants";

export { SESSION_COOKIE_NAME, SESSION_MAX_AGE_MS };

function normalizePrivateKey(key: string): string {
  let normalized = key.trim();
  if (
    (normalized.startsWith('"') && normalized.endsWith('"')) ||
    (normalized.startsWith("'") && normalized.endsWith("'"))
  ) {
    normalized = normalized.slice(1, -1);
  }
  return normalized.replace(/\\n/g, "\n");
}

export function isFirebaseAdminConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID?.trim() &&
      process.env.FIREBASE_CLIENT_EMAIL?.trim() &&
      process.env.FIREBASE_PRIVATE_KEY?.trim(),
  );
}

let adminInitError: string | null = null;

export function getAdminApp(): App | null {
  if (!isFirebaseAdminConfigured()) return null;

  if (adminInitError) return null;

  if (getApps().length) return getApps()[0]!;

  try {
    return initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID!.trim(),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!.trim(),
        privateKey: normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY!),
      }),
    });
  } catch (err) {
    adminInitError =
      err instanceof Error ? err.message : "Firebase Admin initialization failed";
    console.error("Firebase Admin init error:", err);
    return null;
  }
}

export function getAdminInitError(): string | null {
  return adminInitError;
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
