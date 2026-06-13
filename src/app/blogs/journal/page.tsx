import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { journalPosts } from "@/lib/journal-posts";

export const metadata = {
  title: "Journal",
  description: "Studio notes, inspirations, and creative reflections from Mohasti.",
};

export default function JournalPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
      <h1 className="font-display text-4xl font-medium text-mohasti-teal">
        Journal
      </h1>
      <p className="mt-4 text-mohasti-teal-dark/90">
        Studio notes, inspirations, and creative reflections from the Mohasti
        circle.
      </p>
      <div className="mt-12 space-y-8">
        {journalPosts.map((post) => (
          <article
            key={post.slug}
            className="card-elevated p-6 transition-shadow hover:shadow-[var(--shadow-card)]"
          >
            <time className="text-xs text-gray-600">{post.date}</time>
            <h2 className="mt-2 font-display text-2xl text-mohasti-teal">
              {post.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-mohasti-teal-dark/80">
              {post.excerpt}
            </p>
            <Link
              href={`/blogs/journal/${post.slug}`}
              className="mt-4 inline-block text-sm font-medium text-mohasti-teal hover:text-mohasti-cyan"
            >
              Read more →
            </Link>
          </article>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Button href="/collections/all" variant="outline">
          Shop the Collection
        </Button>
      </div>
    </div>
  );
}
