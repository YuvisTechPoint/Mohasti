export function isRazorpayConfigured(): boolean {
  return Boolean(
    process.env.RAZORPAY_KEY_ID?.trim() && process.env.RAZORPAY_KEY_SECRET?.trim(),
  );
}

export function getPublicKey(): string | null {
  return (
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim() ??
    process.env.RAZORPAY_KEY_ID?.trim() ??
    null
  );
}
