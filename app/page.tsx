import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HeroSlideshow from "./components/HeroSlideshow";
import MenuSection from "./components/MenuSection";
import EventsSection from "./components/EventsSection";
import HeroMenuButton from "./components/HeroMenuButton";

export const metadata: Metadata = {
  title: "Kōzo Los Angeles | Afro-Asian Fine Dining on the Sunset Strip",
  description:
    "Kōzo Los Angeles — Afro-Asian fine dining on the Sunset Strip in West Hollywood. Experience elevated sushi, Pan-Asian cuisine, and African flavors in an intimate setting at 8500 W Sunset Blvd.",
  alternates: { canonical: "https://www.kozousa.com" },
  openGraph: {
    url: "https://www.kozousa.com",
    title: "Kōzo Los Angeles | Afro-Asian Fine Dining on the Sunset Strip",
    description: "Afro-Asian fine dining on the Sunset Strip. Elevated sushi, Pan-Asian cuisine, and African hospitality in West Hollywood.",
  },
};

export default function Home() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Restaurant",
            name: "Kōzo Los Angeles",
            url: "https://www.kozousa.com",
            logo: "https://www.kozousa.com/kozo-circl.png",
            image: "https://www.kozousa.com/og-image.jpg",
            description:
              "Kōzo is an Afro-Asian restaurant on the Sunset Strip in West Hollywood. Vibrant African flavours meet Pan-Asian precision in a refined dining experience.",
            foundingDate: "2025",
            servesCuisine: ["African", "Asian", "Pan-Asian", "Sushi", "Japanese", "Fusion", "Farm to Table", "Contemporary"],
            priceRange: "$$$",
            keywords: "Kozo Los Angeles, Kozo LA, Kozo West Hollywood, Kozo Sunset Strip, Afro-Asian restaurant Los Angeles, fine dining LA, sushi West Hollywood, Asian restaurant Los Angeles, Sunset Strip restaurants",
            address: {
              "@type": "PostalAddress",
              streetAddress: "8500 W Sunset Blvd",
              addressLocality: "West Hollywood",
              addressRegion: "CA",
              postalCode: "90069",
              addressCountry: "US",
            },
            email: "info@kozousa.com",
            sameAs: ["https://www.instagram.com/kozolosangeles/?hl=en"],
          }),
        }}
      />
      <section className="kozo-hero">
        <HeroSlideshow />

        <Navbar />

        <main className="relative z-10 flex min-h-[100svh] items-center">
          <div className="mx-auto w-full max-w-[1120px] px-8">
            <div className="mx-auto max-w-[900px] pt-10 text-center text-white">
              <h1
                className="text-[56px] font-normal leading-[1.05] tracking-wide"
                style={{
                  fontFamily:
                    "var(--font-display), ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
                  textShadow: "0 10px 35px rgba(0,0,0,0.55)",
                }}
              >
                The Afro - Asian Experience
              </h1>
              <p className="mt-4 text-[20px] font-medium tracking-wide text-white/85">
                More than just a restaurant
              </p>
              <div className="mt-8 flex justify-center">
                <HeroMenuButton />
              </div>
            </div>
          </div>
        </main>
      </section>

      <section id="our-story" className="kozo-intro" aria-label="KŌZO intro">
        <Image
          src="/about.webp"
          alt=""
          fill
          className="object-cover object-center"
          style={{ zIndex: 0 }}
        />
        <div className="kozo-intro__circle" aria-hidden="true">
          <Image
            src="/kozo-circl.webp"
            alt=""
            width={620}
            height={620}
            priority={false}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-[1120px] px-8">
          <div className="mx-auto max-w-[980px] text-center text-white">
            <h2
              className="kozo-intro__title"
              style={{
                fontFamily:
                  "var(--font-display), ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
              }}
            >
              An unforgettable dining Experience
            </h2>
            <p className="kozo-intro__copy">
              Kōzo began in Accra with a menu inspired by the flavours of Africa. 
              Today, our Afro-Asian kitchen has a home on West Hollywood’s Sunset Strip. 
            </p>
            <p className="kozo-intro__copy mt-5">
              We tell our story through food, bringing African ingredients and 
              Asian cooking traditions to the same table. For us, African luxury 
              is in the warmth of the welcome and the care we bring to every celebration.
            </p>
            <div className="mt-10">
              <a
                href="https://www.instagram.com/kozolosangeles/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-[3px] border border-[#F2E4B1] px-6 py-3 text-[12px] font-semibold tracking-widest text-[#F2E4B1] uppercase transition hover:bg-[#F0C2B2] hover:border-[#F0C2B2] hover:text-black/80"
              >
                Our Community
              </a>
            </div>
          </div>
        </div>
      </section>

      <MenuSection />

      <EventsSection />

      <Footer />
    </div>
  );
}
