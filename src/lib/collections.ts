import type { Collection } from "@/types";

export const collections: Collection[] = [
  {
    handle: "postcards",
    title: "Postcards",
    description: "Original art postcards to send light and stillness to someone you love.",
    image: "/images/rose-tapestry.png",
    imageGradient: "linear-gradient(135deg, #0CC0DF 0%, #1E6FD9 100%)",
  },
  {
    handle: "greeting-cards",
    title: "Greeting Cards",
    description: "Hand-illustrated cards for moments of gratitude, friendship, and self-love.",
    image: "/images/rose-tapestry.png",
    imageGradient: "linear-gradient(135deg, #FFDE59 0%, #C9A227 100%)",
  },
  {
    handle: "notebooks",
    title: "Journals & Notebooks",
    description: "Mindful journals for daily intentions, reflections, and creative notes.",
    imageGradient: "linear-gradient(135deg, #1A8A8F 0%, #0CC0DF 100%)",
  },
  {
    handle: "bookmarks",
    title: "Bookmarks & Stickers",
    description: "Small treasures for readers, planners, and everyday rituals.",
    imageGradient: "linear-gradient(135deg, #D4B8F0 0%, #1E6FD9 100%)",
  },
  {
    handle: "new-arrivals",
    title: "New Arrivals",
    description: "Fresh drops from the Mohasti studio.",
    imageGradient: "linear-gradient(135deg, #7DD956 0%, #FFDE59 100%)",
  },
  {
    handle: "favourites",
    title: "Mohasti Favourites",
    description: "Beloved pieces and limited collections from our circle.",
    imageGradient: "linear-gradient(135deg, #0CC0DF 0%, #FFDE59 100%)",
  },
];

export function getCollection(handle: string): Collection | undefined {
  return collections.find((c) => c.handle === handle);
}
