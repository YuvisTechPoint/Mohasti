import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product/ProductGrid";
import { collections, getCollection } from "@/lib/collections";
import { getProductsByCollection } from "@/lib/products";

export function generateStaticParams() {
  return collections.map((c) => ({ handle: c.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const collection = getCollection(handle);
  if (!collection) return {};
  return {
    title: collection.title,
    description: collection.description,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const collection = getCollection(handle);
  if (!collection) notFound();

  const collectionProducts = getProductsByCollection(handle);

  return (
    <div>
      <div className="relative overflow-hidden py-20 md:py-28">
        {collection.image ? (
          <Image
            src={collection.image}
            alt=""
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: collection.imageGradient }}
          />
        )}
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <nav className="mb-4 text-sm text-white/80">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/collections/all" className="hover:text-white">
              Shop
            </Link>
            <span className="mx-2">/</span>
            <span>{collection.title}</span>
          </nav>
          <h1 className="font-display text-4xl font-medium text-white md:text-5xl">
            {collection.title}
          </h1>
          <p className="mt-4 max-w-xl text-white/90">{collection.description}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
        {collectionProducts.length > 0 ? (
          <ProductGrid products={collectionProducts} />
        ) : (
          <p className="py-12 text-center text-gray-600">
            New pieces coming soon.{" "}
            <Link href="/collections/all" className="text-mohasti-teal underline">
              Browse all products
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
