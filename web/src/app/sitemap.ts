import type { MetadataRoute } from "next";
import { collections } from "@/lib/collections";
import { journalPosts } from "@/lib/journal-posts";
import { products } from "@/lib/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://mohasti.com"
  ).replace(/\/$/, "");

  const staticPages = [
    "",
    "/collections/all",
    "/pages/about",
    "/pages/contact",
    "/blogs/journal",
    "/cart",
    "/policies/shipping",
    "/policies/refund",
    "/policies/privacy",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const collectionPages = collections.map((c) => ({
    url: `${base}/collections/${c.handle}`,
    lastModified: new Date(),
  }));

  const productPages = products.map((p) => ({
    url: `${base}/products/${p.handle}`,
    lastModified: new Date(),
  }));

  const journalPages = journalPosts.map((p) => ({
    url: `${base}/blogs/journal/${p.slug}`,
    lastModified: new Date(),
  }));

  return [...staticPages, ...collectionPages, ...productPages, ...journalPages];
}
