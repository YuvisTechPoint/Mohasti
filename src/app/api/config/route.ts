import { NextResponse } from "next/server";
import { isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { isFirebaseClientConfigured } from "@/lib/firebase/client";
import { getPublicKey, isRazorpayConfigured } from "@/lib/razorpay";

export async function GET() {
  return NextResponse.json({
    demoMode: !isRazorpayConfigured(),
    razorpayPublicKey: getPublicKey(),
    firebaseClient: isFirebaseClientConfigured(),
    firebaseAdmin: isFirebaseAdminConfigured(),
  });
}
