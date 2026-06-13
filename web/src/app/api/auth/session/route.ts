import { NextResponse } from "next/server";
import {
  getAdminAuth,
  isFirebaseAdminConfigured,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_MS,
} from "@/lib/firebase/admin";
import { linkGuestOrdersToUser } from "@/lib/orders";

export async function POST(request: Request) {
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json(
      { error: "Firebase Admin is not configured." },
      { status: 503 },
    );
  }

  const auth = getAdminAuth();
  if (!auth) {
    return NextResponse.json({ error: "Auth unavailable." }, { status: 503 });
  }

  try {
    const { idToken } = await request.json();
    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken." }, { status: 400 });
    }

    const decoded = await auth.verifyIdToken(idToken);
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_MAX_AGE_MS,
    });

    if (decoded.email) {
      await linkGuestOrdersToUser(decoded.uid, decoded.email);
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
