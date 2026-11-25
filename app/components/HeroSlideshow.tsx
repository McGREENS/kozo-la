"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const desktopImages = [
  "/HERO1.jpg",
  "/HERO2.jpg",
  "/HERO3.jpg",
  "/HERO4.jpg",
];

const mobileImages = [
  "/helophone1.jpg",
  "/helophone2.jpg",
  "/helophone3.jpg",
  "/helophone1.jpg", // Repeat first to match desktop count
];

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile on mount
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const images = isMobile ? mobileImages : desktopImages;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isMobile]);

  const images = isMobile ? mobileImages : desktopImages;

  return (
    <>
      {images.map((src, i) => (
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
