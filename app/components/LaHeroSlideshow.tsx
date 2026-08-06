"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * LaHeroSlideshow
 *
 * Full-screen crossfade slideshow using the same pattern as kozo-next's
 * HeroSlideshow. Images cycle every 5 seconds with a 1s opacity transition.
 * Swap these paths for LA-specific photography when it's ready.
 */
const heroImages = [
  "/hero.webp",
  "/hero-2.webp",
  "/hero-3.webp",
  "/hero-4.webp",
  "/hero-5.webp",
  "/hero-6.webp",
];

export default function LaHeroSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {heroImages.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          priority={i === 0}
          className={`object-cover object-center transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </>
  );
}
