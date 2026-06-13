# Mohasti Website

Spiritual art & stationery e-commerce for **MOHASTI** — Next.js 16, TypeScript, Tailwind CSS v4, Razorpay payments, GST invoicing.

## Quick Start

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Payment Gateway (Razorpay)

1. Copy `.env.example` to `.env.local`
2. Add your Razorpay test/live keys from [dashboard.razorpay.com](https://dashboard.razorpay.com/)
3. Restart the dev server

```env
RAZORPAY_KEY_ID=rzp_test_xxxx
RAZORPAY_KEY_SECRET=your_secret
```

**Without keys:** checkout runs in **demo mode** — payment is simulated, but orders and GST invoices are still generated.

### Checkout flow

```
Cart → Checkout (shipping) → Payment (Razorpay UPI/Cards/NetBanking)
  → Order confirmed → Download GST invoice
```

- Server-side price validation (never trust client totals)
- Discount code `NEWSLETTER10` = 10% off
- Free shipping on orders over Rs. 1,500
- 12% GST (CGST/SGST intra-state, IGST inter-state)
- Invoice at `/orders/[orderId]/invoice` (print to PDF)

## What's Included

- Polished storefront UI with brand gradient system
- 14 products, 6 collections, cart drawer + cart page
- Multi-step checkout with live order summary
- Razorpay payment integration + webhook-ready verify API
- GST tax invoice (HSN codes, seller GSTIN, payment ref)
- Order success page with invoice download

## Project Structure

```
web/
├── src/app/api/          Payment & order APIs
├── src/app/checkout/     Multi-step checkout
├── src/app/orders/       Success + invoice pages
├── src/components/       UI, checkout, invoice
├── src/lib/              pricing, orders, razorpay
└── .data/orders/         Order storage (local dev)
```

## Production Deployment

1. Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` on Vercel
2. Replace file-based order storage with Postgres/Supabase
3. Add email service (Resend) to send invoices on payment
4. Replace SVG logo with official brand assets

## Reference Sites

- [ishathigale.com](https://www.ishathigale.com/)
- [timyangerart.myshopify.com](https://timyangerart.myshopify.com/)
