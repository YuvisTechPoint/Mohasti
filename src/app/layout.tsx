import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Montserrat } from "next/font/google";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import { CookieConsent } from "@/components/ui/CookieConsent";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://mohasti.com",
  ),
  title: {
    default: "Mohasti | Spiritual Art & Stationery",
    template: "%s | Mohasti",
  },
  description:
    "Mohasti creates original art, postcards, journals, and mindful stationery inspired by stillness and everyday rituals.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Mohasti | Spiritual Art & Stationery",
    description:
      "Original art and mindful stationery inspired by stillness and everyday rituals.",
    url: "https://mohasti.com",
    siteName: "Mohasti",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/brand/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mohasti — Spiritual Art & Stationery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohasti | Spiritual Art & Stationery",
    description:
      "Original art and mindful stationery inspired by stillness and everyday rituals.",
    images: ["/brand/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${montserrat.variable} h-full print:h-auto print:min-h-0`}
    >
      <body className="min-h-full flex flex-col antialiased print:block print:min-h-0 print:h-auto">
        <AuthProvider>
          <CartProvider>
            <AnnouncementBar />
            <Header />
            <main className="flex-1 print:block print:min-h-0">{children}</main>
            <Footer />
            <CartDrawer />
            <CookieConsent />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
