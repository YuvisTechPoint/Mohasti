export type JournalPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string[];
};

export const journalPosts: JournalPost[] = [
  {
    slug: "morning-rituals",
    title: "Morning Rituals & the Art of Starting Slow",
    date: "March 12, 2025",
    excerpt:
      "How a simple tea ritual became the inspiration for our first postcard collection.",
    content: [
      "Every Mohasti piece begins in the quiet — before emails, before the city wakes. Our Morning Rituals collection started on a balcony with a cup of chai and a blank postcard.",
      "We wanted to capture that first breath of the day: steam rising, light shifting, the world still soft. The Tea Ritual postcard was the first sketch — and it became one of our most-loved pieces.",
      "Starting slow isn't about doing less. It's about doing the first thing with presence. That's the energy we bring into every design.",
    ],
  },
  {
    slug: "lotus-symbolism",
    title: "Why the Lotus Appears in Everything We Make",
    date: "February 28, 2025",
    excerpt:
      "The lotus rises from still water — a symbol of growth without force.",
    content: [
      "The lotus doesn't fight the water. It rests in it, draws nourishment from it, and rises when it's ready. That philosophy runs through Mohasti.",
      "You'll find the lotus in our logo, our Lotus Dawn postcard, and in the glow that appears across our brand. It's a reminder that beauty doesn't require struggle.",
      "We create for people who are building something gentle — a practice, a home, a daily rhythm. The lotus is their emblem.",
    ],
  },
  {
    slug: "studio-notes",
    title: "Studio Notes: Behind the 2026 Calendar",
    date: "February 10, 2025",
    excerpt:
      "Twelve months of art, twelve moments of pause. A peek into our calendar process.",
    content: [
      "The 2026 Art Calendar began as a question: what if each month had its own small ritual? Twelve scenes, twelve invitations to pause.",
      "We work in gouache and digital, often starting with colour swatches pulled from dawn and dusk. Each postcard in the set is designed to stand alone — frame it, send it, or pin it to your wall.",
      "Pre-orders are open now. We print in small batches to keep quality high and waste low.",
    ],
  },
];

export function getJournalPost(slug: string): JournalPost | undefined {
  return journalPosts.find((p) => p.slug === slug);
}
