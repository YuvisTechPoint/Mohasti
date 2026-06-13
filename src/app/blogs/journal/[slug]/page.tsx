import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { getJournalPost, journalPosts } from "@/lib/journal-posts";

export function generateStaticParams() {
  return journalPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getJournalPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getJournalPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
      <nav className="mb-8 text-sm text-gray-600">
        <Link href="/" className="hover:text-mohasti-cyan">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/blogs/journal" className="hover:text-mohasti-cyan">
          Journal
        </Link>
      </nav>
      <time className="text-sm text-gray-600">{post.date}</time>
      <h1 className="mt-2 font-display text-4xl font-medium text-mohasti-teal">
        {post.title}
      </h1>
      <div className="mt-8 space-y-5 leading-relaxed text-mohasti-teal-dark/90">
        {post.content.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </div>
      <div className="mt-12 flex flex-wrap gap-4">
        <Button href="/blogs/journal" variant="outline">
          ← All posts
        </Button>
        <Button href="/collections/all">Shop Collection</Button>
      </div>
    </article>
  );
}
