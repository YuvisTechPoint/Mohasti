import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "About",
  description:
    "The story of Mohasti — spiritual art and mindful stationery born from stillness.",
};

export default function AboutPage() {
  return (
    <div>
      <section className="hero-gradient relative py-24 md:py-32">
        <div className="lotus-glow absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-3xl px-4 text-center md:px-6">
          <h1 className="font-display text-4xl font-medium text-mohasti-teal-dark md:text-5xl">
            Our Story
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
        <p className="leading-relaxed text-mohasti-teal-dark/90">
          Mohasti was born from a simple belief: that art and stillness belong in
          everyday life. Not reserved for galleries or special occasions — but
          woven into the rituals we already practice. A cup of tea. A page turned.
          A note sent to someone we love.
        </p>
        <p className="mt-6 leading-relaxed text-mohasti-teal-dark/90">
          Our name carries the essence of what we create — pieces that hold space
          for reflection, compassion, and light. The lotus rising from still
          water. The crescent moon marking quiet hours. The heart-line, one
          continuous stroke of care.
        </p>
        <blockquote className="my-12 border-l-4 border-mohasti-gold pl-6 font-display text-2xl font-medium italic text-mohasti-teal md:text-3xl">
          &ldquo;We don&apos;t ask you to escape life. We invite you to meet it
          with more beauty.&rdquo;
        </blockquote>
        <p className="leading-relaxed text-mohasti-teal-dark/90">
          Every postcard, journal, and greeting card begins in the studio as an
          original artwork — inspired by nature, ritual, and the ordinary
          moments that hold extraordinary meaning. We print on quality paper,
          pack with care, and send each piece hoping it finds the right hands.
        </p>
        <p className="mt-6 leading-relaxed text-mohasti-teal-dark/90">
          Mohasti is for the person who journals at dawn, who sends postcards
          instead of texts, who believes that small objects can carry big
          intention. Welcome to our circle.
        </p>
      </section>

      <section className="bg-gray-100 py-16 md:py-24">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 md:grid-cols-3 md:px-6">
          {[
            {
              icon: "🪷",
              title: "Growth",
              text: "Like the lotus, we create from stillness — rising with intention.",
            },
            {
              icon: "🌙",
              title: "Reflection",
              text: "The moon reminds us to pause, rest, and return to ourselves.",
            },
            {
              icon: "💛",
              title: "Compassion",
              text: "The heart-line is one stroke — continuous care for self and others.",
            },
          ].map((value) => (
            <div
              key={value.title}
              className="rounded-2xl bg-white p-8 text-center shadow-sm"
            >
              <span className="text-4xl" aria-hidden>
                {value.icon}
              </span>
              <h3 className="mt-4 font-display text-xl text-mohasti-teal">
                {value.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-mohasti-teal-dark/80">
                {value.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 text-center md:py-24">
        <Button href="/collections/all" size="lg">
          Explore the Collection
        </Button>
      </section>
    </div>
  );
}
