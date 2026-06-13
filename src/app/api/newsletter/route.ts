import { NextResponse } from "next/server";
import { getAdminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { requireFirebaseAdminMessage } from "@/lib/env";

export async function POST(request: Request) {
  try {
    if (!isFirebaseAdminConfigured()) {
      return NextResponse.json(
        { error: requireFirebaseAdminMessage() },
        { status: 503 },
      );
    }

    const db = await getAdminDb();
    if (!db) {
      return NextResponse.json(
        { error: requireFirebaseAdminMessage() },
        { status: 503 },
      );
    }

    const { email } = await request.json();
    const normalized = String(email ?? "").trim().toLowerCase();

    if (!normalized || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    await db.collection("newsletter_leads").add({
      email: normalized,
      source: "homepage",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Subscribed successfully.",
      discountCode: "NEWSLETTER10",
    });
  } catch (err) {
    console.error("Newsletter subscribe error:", err);
    return NextResponse.json(
      { error: "Subscription failed. Please try again." },
      { status: 500 },
    );
  }
}
