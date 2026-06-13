export type ProductStatus = "available" | "sold_out" | "pre_order" | "new";

export type Collection = {
  handle: string;
  title: string;
  description: string;
  imageGradient: string;
  image?: string;
};

export type Product = {
  handle: string;
  title: string;
  collection: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  shortDescription: string;
  story: string;
  details: string;
  shipping: string;
  care: string;
  status: ProductStatus;
  imageGradient: string;
  image?: string;
  hsnCode?: string;
  tags?: string[];
  isSubscription?: boolean;
  promoLabel?: string;
  specifications?: { label: string; value: string }[];
  highlights?: string[];
};

export type CartItem = {
  handle: string;
  title: string;
  price: number;
  quantity: number;
  imageGradient: string;
  image?: string;
};

export type ShippingAddress = {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  gstin?: string;
};

export type OrderLineItem = {
  handle: string;
  title: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  hsnCode: string;
  imageGradient: string;
  image?: string;
};

export type OrderTotals = {
  subtotal: number;
  discount: number;
  discountCode?: string;
  shipping: number;
  giftWrap: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  gstTotal: number;
  grandTotal: number;
};

export type PaymentInfo = {
  method: "razorpay" | "demo" | "cod";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paidAt?: string;
};

export type OrderStatus =
  | "pending_payment"
  | "confirmed"
  | "paid"
  | "failed"
  | "cancelled";

export type Order = {
  id: string;
  invoiceNumber: string;
  accessToken?: string;
  shippingEmail?: string;
  userId?: string;
  status: OrderStatus;
  items: OrderLineItem[];
  shipping: ShippingAddress;
  totals: OrderTotals;
  payment: PaymentInfo;
  createdAt: string;
  updatedAt: string;
};

export type CheckoutStep = "shipping" | "payment" | "review";
