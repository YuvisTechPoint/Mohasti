import { cookies } from "next/headers";
import {
  getAdminAuth,
  isFirebaseAdminConfigured,
  SESSION_COOKIE_NAME,
} from "@/lib/firebase/admin";

export type SessionUser = {
  uid: string;
  email: string | null;
  name: string | null;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  if (!isFirebaseAdminConfigured()) return null;

  const auth = await getAdminAuth();
  if (!auth) return null;

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await auth.verifySessionCookie(sessionCookie, true);
    return {
      uid: decoded.uid,
      email: decoded.email ?? null,
      name: decoded.name ?? null,
    };
  } catch {
    return null;
  }
}
