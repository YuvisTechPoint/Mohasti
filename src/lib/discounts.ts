export type DiscountDefinition = {
  code: string;
  rate: number;
  label: string;
  description: string;
};

export const DISCOUNT_LIST: DiscountDefinition[] = [
  {
    code: "NEWSLETTER10",
    rate: 0.1,
    label: "10% off",
    description: "Newsletter subscriber offer",
  },
];

export const DISCOUNT_CODES: Record<string, number> = Object.fromEntries(
  DISCOUNT_LIST.map((d) => [d.code, d.rate]),
);

export function normalizeDiscountCode(raw: string): string {
  return raw.trim().replace(/\s+/g, "").toUpperCase();
}

export function resolveDiscountCode(raw?: string): {
  valid: boolean;
  code?: string;
  rate: number;
  definition?: DiscountDefinition;
  error?: string;
} {
  const trimmed = raw?.trim() ?? "";
  if (!trimmed) {
    return { valid: false, rate: 0, error: "Enter a discount code." };
  }

  const normalized = normalizeDiscountCode(trimmed);
  const definition = DISCOUNT_LIST.find((d) => d.code === normalized);

  if (!definition) {
    return {
      valid: false,
      rate: 0,
      error: "This code isn’t valid or has expired.",
    };
  }

  return {
    valid: true,
    code: definition.code,
    rate: definition.rate,
    definition,
  };
}

export function getPublicDiscountHints(): string[] {
  return DISCOUNT_LIST.map((d) => `${d.code} — ${d.label}`);
}
