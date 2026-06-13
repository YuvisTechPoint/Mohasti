export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

/** Demo payments only when Razorpay is off and not production (unless explicitly allowed). */
export function isDemoPaymentsAllowed(): boolean {
  if (process.env.ALLOW_DEMO_PAYMENTS === "true") return true;
  return !isProduction();
}

export function requireFirebaseAdminMessage(): string {
  return "Service temporarily unavailable. Please try again later.";
}
