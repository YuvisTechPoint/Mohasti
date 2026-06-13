import type { App } from "firebase-admin/app";
import type { Auth } from "firebase-admin/auth";
import type { Firestore } from "firebase-admin/firestore";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_MS,
} from "@/lib/firebase/constants";
import {
  isFirebaseAdminConfigured,
  normalizePrivateKey,
} from "@/lib/firebase/admin-config";

export { SESSION_COOKIE_NAME, SESSION_MAX_AGE_MS };
export { isFirebaseAdminConfigured } from "@/lib/firebase/admin-config";

let adminInitError: string | null = null;
let adminApp: App | null = null;
let adminAppReady = false;

async function ensureAdminApp(): Promise<App | null> {
  if (!isFirebaseAdminConfigured()) return null;
  if (adminInitError) return null;
  if (adminAppReady) return adminApp;

  try {
    const { cert, getApps, initializeApp } = await import("firebase-admin/app");

    if (getApps().length) {
      adminApp = getApps()[0]!;
    } else {
      adminApp = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID!.trim(),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL!.trim(),
          privateKey: normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY!),
        }),
      });
    }

    adminAppReady = true;
    return adminApp;
  } catch (err) {
    adminInitError =
      err instanceof Error ? err.message : "Firebase Admin initialization failed";
    console.error("Firebase Admin init error:", err);
    adminAppReady = true;
    adminApp = null;
    return null;
  }
}

export function getAdminInitError(): string | null {
  return adminInitError;
}

export async function getAdminAuth(): Promise<Auth | null> {
  const app = await ensureAdminApp();
  if (!app) return null;

  try {
    const { getAuth } = await import("firebase-admin/auth");
    return getAuth(app);
  } catch (err) {
    adminInitError =
      err instanceof Error ? err.message : "Firebase Auth module failed to load";
    console.error("Firebase Auth load error:", err);
    return null;
  }
}

let cachedDb: Firestore | null = null;

export async function getAdminDb(): Promise<Firestore | null> {
  if (cachedDb) return cachedDb;

  const app = await ensureAdminApp();
  if (!app) return null;

  try {
    const { getFirestore } = await import("firebase-admin/firestore");
    const db = getFirestore(app);
    try {
      db.settings({ ignoreUndefinedProperties: true });
    } catch {
      // Firestore may already be initialized (dev HMR or prior use).
    }

    cachedDb = db;
    return db;
  } catch (err) {
    adminInitError =
      err instanceof Error ? err.message : "Firestore module failed to load";
    console.error("Firestore load error:", err);
    return null;
  }
}
