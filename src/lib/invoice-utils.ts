/** Mohasti brand tokens for invoices & PDF output */
export const INVOICE_BRAND = {
  teal: "#1A8A8F",
  tealDark: "#0f5c60",
  cyan: "#0CC0DF",
  yellow: "#FFDE59",
  gold: "#c9a227",
} as const;

export const INVOICE_SELLER = {
  name: "Mohasti",
  legalName: "Mohasti Studio LLP",
  tagline: "Spiritual Art & Stationery",
  address: "Studio 4, Bandra West, Mumbai, Maharashtra 400050, India",
  email: "hello@mohasti.com",
  phone: "+91 98765 43210",
  website: "mohasti.com",
  gstin: "27AABCM1234A1Z5",
  pan: "AABCM1234A",
  state: "Maharashtra",
  stateCode: "27",
} as const;

const ones = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const tens = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

function twoDigits(n: number): string {
  if (n < 20) return ones[n] ?? "";
  const t = Math.floor(n / 10);
  const o = n % 10;
  return `${tens[t]}${o ? ` ${ones[o]}` : ""}`.trim();
}

function threeDigits(n: number): string {
  if (n === 0) return "";
  if (n < 100) return twoDigits(n);
  const h = Math.floor(n / 100);
  const rest = n % 100;
  return `${ones[h]} Hundred${rest ? ` ${twoDigits(rest)}` : ""}`;
}

function indianNumberWords(n: number): string {
  if (n === 0) return "Zero";

  const parts: string[] = [];
  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const hundred = n % 1000;

  if (crore) parts.push(`${threeDigits(crore)} Crore`);
  if (lakh) parts.push(`${twoDigits(lakh)} Lakh`);
  if (thousand) parts.push(`${twoDigits(thousand)} Thousand`);
  if (hundred) parts.push(threeDigits(hundred));

  return parts.join(" ");
}

export function amountInWordsInr(amount: number): string {
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);

  let words = indianNumberWords(rupees);
  words = words ? `${words} Rupees` : "Zero Rupees";

  if (paise > 0) {
    words += ` and ${twoDigits(paise)} Paise`;
  }

  return `${words} Only`;
}

export function formatInvoiceDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

export function formatInvoiceDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
}

export function paymentMethodLabel(method: string): string {
  if (method === "razorpay") return "Razorpay — UPI / Card / Net Banking";
  if (method === "demo") return "Demo Payment";
  if (method === "cod") return "Cash on Delivery (COD)";
  return method;
}

export function invoicePaymentDateLabel(order: {
  status: string;
  payment: { method: string; paidAt?: string };
}): string {
  if (order.payment.paidAt) {
    return formatInvoiceDate(order.payment.paidAt);
  }
  if (order.payment.method === "cod") {
    return "Pay on delivery";
  }
  return "Pending";
}

export function invoiceStatusBadge(order: {
  status: string;
  payment: { method: string };
}): { label: string; tone: "paid" | "cod" | "pending" } {
  if (order.status === "paid") {
    return { label: "PAID", tone: "paid" };
  }
  if (order.payment.method === "cod" || order.status === "confirmed") {
    return { label: "COD", tone: "cod" };
  }
  return { label: "PENDING", tone: "pending" };
}

export function gstSupplyType(isIntraState: boolean): string {
  return isIntraState ? "Intra-state (CGST + SGST)" : "Inter-state (IGST)";
}
