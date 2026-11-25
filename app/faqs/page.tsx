import Image from "next/image";
import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "FAQs - Kōzo",
  description: "Frequently asked questions about Kōzo - operating hours, location, parking, dress code, and reservations.",
};

const displayFont = "var(--font-display), ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif";

export default function FAQsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ background: "var(--kozo-cream)" }}>
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <Image
          src="/about.webp"
          alt="Kōzo interior"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1
            className="text-5xl md:text-7xl font-light tracking-[0.28em] text-white drop-shadow-2xl"
            style={{ fontFamily: displayFont }}
          >
            FAQs
          </h1>
        </div>
      </section>

      {/* FAQs Content */}
      <section className="mx-auto max-w-[1000px] px-6 md:px-12 py-20 md:py-32">
        <div className="space-y-16">
          {/* Operating Hours */}
          <div className="border-b border-black/10 pb-12">
            <h2 
              className="text-3xl md:text-4xl font-light text-[#1a1a1a] mb-6 tracking-wide"
              style={{ fontFamily: displayFont }}
            >
              Operating Hours?
            </h2>
            <div className="text-[#3a3a3a] text-lg leading-loose space-y-2">
              <p>Wednesday and Sunday, 5:30pm to 10:30pm.</p>
              <p>Thursday to Saturday, 5:30pm to 11:30pm.</p>
              <p className="font-semibold mt-4 text-[#1a1a1a]">Closed Monday and Tuesday.</p>
            </div>
          </div>

          {/* Location */}
          <div className="border-b border-black/10 pb-12">
            <h2 
              className="text-3xl md:text-4xl font-light text-[#1a1a1a] mb-6 tracking-wide"
              style={{ fontFamily: displayFont }}
            >
              Where is Kōzo?
            </h2>
            <p className="text-[#3a3a3a] text-lg leading-loose">
              8500 W Sunset Blvd, West Hollywood, CA 90069.{" "}
              <a
                href="https://maps.apple.com/?address=8500%20W%20Sunset%20Blvd,%20West%20Hollywood,%20CA%2090069"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8B7355] hover:text-[#6B5335] underline underline-offset-4 decoration-1 transition-colors font-medium"
              >
                Get directions
              </a>{" "}
              <span className="text-[#666]">(open Apple Maps)</span>
            </p>
          </div>

          {/* Valet Parking */}
          <div className="border-b border-black/10 pb-12">
            <h2 
              className="text-3xl md:text-4xl font-light text-[#1a1a1a] mb-6 tracking-wide"
              style={{ fontFamily: displayFont }}
            >
              Is valet parking available?
            </h2>
            <p className="text-[#3a3a3a] text-lg leading-loose">
              Yes, valet parking is available at Kōzo.
            </p>
          </div>

          {/* Dress Code */}
          <div className="border-b border-black/10 pb-12">
            <h2 
              className="text-3xl md:text-4xl font-light text-[#1a1a1a] mb-6 tracking-wide"
              style={{ fontFamily: displayFont }}
            >
              What&apos;s the dress code?
            </h2>
            <p className="text-[#3a3a3a] text-lg leading-loose max-w-[800px]">
              Kōzo upholds a refined, upscale aesthetic, and we encourage guests to dress
              accordingly. Our dress code is smart casual. Whether joining us for a special
              occasion or an evening out, we look forward to welcoming you.
            </p>
          </div>

          {/* Large Groups */}
          <div className="pb-12">
            <h2 
              className="text-3xl md:text-4xl font-light text-[#1a1a1a] mb-6 tracking-wide"
              style={{ fontFamily: displayFont }}
            >
              Can I reserve a table for a large group?
            </h2>
            <p className="text-[#3a3a3a] text-lg leading-loose">
              For parties of eight or more, please email our events team at{" "}
              <a
                href="mailto:reserve@kozousa.com"
                className="text-[#8B7355] hover:text-[#6B5335] underline underline-offset-4 decoration-1 transition-colors font-medium"
              >
                reserve@kozousa.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>
      </main>
      <Footer />
    </>
  );
}
