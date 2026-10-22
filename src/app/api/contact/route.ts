import { NextResponse } from "next/server";
import { getAdminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const subject = String(body.subject ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (isFirebaseAdminConfigured()) {
      try {
        const db = await getAdminDb();
        if (db) {
          await db.collection("contact_messages").add({
            name,
            email,
            subject,
            message,
            createdAt: new Date().toISOString(),
          });
        }
      } catch (dbErr) {
        console.warn("Could not save contact message to Firestore:", dbErr);
      }
    } else {
      console.log("[Contact form message (demo/local)]", { name, email, subject, message });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 },
    );
  }
}
