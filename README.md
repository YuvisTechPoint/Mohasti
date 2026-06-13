# Mohasti

Spiritual art & mindful stationery — e-commerce storefront built with Next.js.

## Repository layout

| Path | Description |
|------|-------------|
| `web/` | Next.js 16 application (deploy this directory) |
| `images/` | Source brand & product image assets |
| `Mohasti Logo.jpeg` | Official brand logo |

## Quick start

```bash
cd web
npm install
cp .env.example .env.local   # add Firebase + Razorpay keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Import this repository on [vercel.com](https://vercel.com).
2. Set **Root Directory** to `web`.
3. Add environment variables from `web/.env.example` (see below).
4. Deploy — Vercel runs `npm run build` automatically.

### Required production environment variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_FIREBASE_*` | Google sign-in (client) |
| `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` | Auth sessions + order storage |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | Live payments |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay checkout widget |

Without Razorpay keys the site runs in **demo payment mode**. Without Firebase Admin, **orders cannot be saved in production**.

### Firebase setup

- Enable Google sign-in in Firebase Console.
- Add your production domain to **Authorized domains**.
- For `FIREBASE_PRIVATE_KEY`, paste the full key with `\n` for newlines (Vercel supports multiline values).

## Scripts

```bash
cd web
npm run dev      # development
npm run build    # production build
npm run start    # serve production build
npm run lint     # ESLint
```

## License

Proprietary — Mohasti.
