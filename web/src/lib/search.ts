import { collections } from "@/lib/collections";
import { journalPosts } from "@/lib/journal-posts";
import { searchProducts } from "@/lib/products";

export type SearchResultItem = {
  type: "product" | "collection" | "journal";
  href: string;
  title: string;
  subtitle: string;
  image?: string;
  price?: number;
};

export type GroupedSearchResults = {
  products: SearchResultItem[];
  collections: SearchResultItem[];
  journal: SearchResultItem[];
};

function matchesQuery(text: string, query: string) {
  return text.toLowerCase().includes(query);
}

export function searchSite(query: string, limitPerGroup = 5): GroupedSearchResults {
  const q = query.toLowerCase().trim();
  if (!q) {
    return { products: [], collections: [], journal: [] };
  }

  const products = searchProducts(q).slice(0, limitPerGroup).map((product) => ({
    type: "product" as const,
    href: `/products/${product.handle}`,
    title: product.title,
    subtitle: product.shortDescription,
    image: product.image,
    price: product.price,
  }));

  const matchedCollections = collections
    .filter(
      (collection) =>
        matchesQuery(collection.title, q) ||
        matchesQuery(collection.description, q) ||
        matchesQuery(collection.handle, q),
    )
    .slice(0, limitPerGroup)
    .map((collection) => ({
      type: "collection" as const,
      href: `/collections/${collection.handle}`,
      title: collection.title,
      subtitle: collection.description,
    }));

  const journal = journalPosts
    .filter(
      (post) =>
        matchesQuery(post.title, q) ||
        matchesQuery(post.excerpt, q) ||
        post.content.some((paragraph) => matchesQuery(paragraph, q)),
    )
    .slice(0, limitPerGroup)
    .map((post) => ({
      type: "journal" as const,
      href: `/blogs/journal/${post.slug}`,
      title: post.title,
      subtitle: post.excerpt,
    }));

  return {
    products,
    collections: matchedCollections,
    journal,
  };
}

export function flattenSearchResults(grouped: GroupedSearchResults): SearchResultItem[] {
  return [...grouped.products, ...grouped.collections, ...grouped.journal];
}

export function hasSearchResults(grouped: GroupedSearchResults) {
  return (
    grouped.products.length > 0 ||
    grouped.collections.length > 0 ||
    grouped.journal.length > 0
  );
}

export function totalSearchResults(grouped: GroupedSearchResults) {
  return grouped.products.length + grouped.collections.length + grouped.journal.length;
}
