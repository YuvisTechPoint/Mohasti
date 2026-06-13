import { NextResponse } from "next/server";
import {
  getAdminAuth,
  getAdminInitError,
  isFirebaseAdminConfigured,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_MS,
} from "@/lib/firebase/admin";
import { linkGuestOrdersToUser } from "@/lib/orders";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json(
      { error: "Firebase Admin is not configured." },
      { status: 503 },
    );
  }

  try {
    const auth = await getAdminAuth();
    if (!auth) {
      const initError = getAdminInitError();
      return NextResponse.json(
        {
          error: initError
            ? "Firebase Admin credentials are invalid."
            : "Auth unavailable.",
          detail: initError ?? undefined,
        },
        { status: 503 },
      );
    }

    const { idToken } = await request.json();
    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken." }, { status: 400 });
    }

    const decoded = await auth.verifyIdToken(idToken);
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_MAX_AGE_MS,
    });

    if (decoded.email) {
      try {
        await linkGuestOrdersToUser(decoded.uid, decoded.email);
      } catch (linkErr) {
        // Don't block sign-in if Firestore isn't ready or order linking fails.
        console.error("Guest order link skipped:", linkErr);
      }
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE_MS / 1000,
      path: "/",
    });
    return response;
  } catch (err) {
    console.error("Session create error:", err);
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }
}
