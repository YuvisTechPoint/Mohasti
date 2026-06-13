import Image from "next/image";

export function CartItemThumb({
  title,
  image,
  imageGradient,
  className = "h-20 w-20",
}: {
  title: string;
  image?: string;
  imageGradient: string;
  className?: string;
}) {
  if (image) {
    return (
      <div
        className={`relative shrink-0 overflow-hidden rounded-lg bg-gray-100 ${className}`}
      >
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover object-center"
          sizes="80px"
        />
      </div>
    );
  }

  return (
    <div
      className={`shrink-0 rounded-lg ${className}`}
      style={{ background: imageGradient }}
      aria-hidden
    />
  );
}
