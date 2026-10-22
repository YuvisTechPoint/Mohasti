import { NextResponse } from "next/server";
import { getAdminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const normalized = String(email ?? "").trim().toLowerCase();

    if (!normalized || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (isFirebaseAdminConfigured()) {
      try {
        const db = await getAdminDb();
        if (db) {
          await db.collection("newsletter_leads").add({
            email: normalized,
            source: "homepage",
            createdAt: new Date().toISOString(),
          });
        }
      } catch (dbErr) {
        console.warn("Could not save newsletter lead to Firestore:", dbErr);
      }
    } else {
      console.log("[Newsletter subscription (demo/local)]", normalized);
    }

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
