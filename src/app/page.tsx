import { BrandStory } from "@/components/home/BrandStory";
import { FeaturedFavourites } from "@/components/home/FeaturedFavourites";
import { Hero } from "@/components/home/Hero";
import { NewLaunches } from "@/components/home/NewLaunches";
import { Newsletter } from "@/components/home/Newsletter";
import { ProductSection } from "@/components/home/ProductSection";
import { StationeryCategories } from "@/components/home/StationeryCategories";
import { products } from "@/lib/products";

export default function HomePage() {
  const postcards = products.filter((p) => p.collection === "postcards");
  const greetingCards = products.filter((p) => p.collection === "greeting-cards");
  const favourites = products.filter(
    (p) => p.collection === "favourites" || p.collection === "new-arrivals",
  );

  return (
    <>
      <Hero />
      <BrandStory />
      <NewLaunches />
      <ProductSection
        title="Postcards"
        products={postcards}
        collectionHandle="postcards"
        centerTitle
      />
      <ProductSection
        title="'Light' Greeting Cards"
        products={greetingCards}
        collectionHandle="greeting-cards"
        centerTitle
      />
      <StationeryCategories />
      <FeaturedFavourites products={favourites} />
      <Newsletter />
    </>
  );
}
