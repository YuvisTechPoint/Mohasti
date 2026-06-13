# Mohasti

Spiritual art & mindful stationery — e-commerce storefront built with Next.js.

## Quick start

```bash
npm install
cp .env.example .env.local   # add Firebase + Razorpay keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Import this repository on [vercel.com](https://vercel.com).
2. Framework should auto-detect as **Next.js** (app lives at the repository root).
3. Add environment variables from `.env.example`.
4. Deploy.

### Required production environment variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_FIREBASE_*` | Google sign-in (client) |
| `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` | Auth sessions + order storage |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | Live payments |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay checkout widget |

Without Razorpay keys the site runs in **demo payment mode**. Without Firebase Admin, **orders cannot be saved in production**.

### Firebase Google sign-in (`auth/unauthorized-domain`)

If Google sign-in fails on Vercel with `auth/unauthorized-domain`, add your live domain in Firebase:

1. Open [Firebase Console → Authentication → Settings](https://console.firebase.google.com/project/mohasti/authentication/settings) (project `mohasti`).
2. Under **Authorized domains**, click **Add domain**.
3. Add `mohasti.vercel.app` (and `mohasti.com` when your custom domain is live).
4. Save, then retry sign-in (no redeploy needed).

### Firebase Firestore (orders)

Enable Firestore for project `mohasti` before testing checkout/orders:

1. [Create Firestore database](https://console.firebase.google.com/project/mohasti/firestore) (production mode).
2. If prompted, enable the [Firestore API](https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=mohasti).
3. Deploy `firestore.rules` from this repo.

Ensure the same `NEXT_PUBLIC_FIREBASE_*` and `FIREBASE_*` variables from `.env.local` are set on Vercel.

## Repository layout

| Path | Description |
|------|-------------|
| `src/` | Next.js application source |
| `public/` | Static assets, favicons, product images |
| `images/` | Source brand & product image assets |

## Scripts

```bash
npm run dev      # development
npm run build    # production build
npm run start    # serve production build
npm run lint     # ESLint
```

## License

Proprietary — Mohasti.
