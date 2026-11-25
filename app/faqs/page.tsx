import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs - Kōzo",
  description: "Frequently asked questions about Kōzo - operating hours, location, parking, dress code, and reservations.",
};

export default function FAQsPage() {
  return (
    <main className="min-h-screen bg-[#F9F7F4]">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <Image
          src="/about.webp"
          alt="Kōzo interior"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1
            className="text-5xl md:text-6xl font-medium tracking-[0.28em] text-white drop-shadow-lg"
            style={{
              fontFamily:
                "var(--font-display), ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
            }}
          >
            FAQs
          </h1>
        </div>
      </section>

      {/* FAQs Content */}
      <section className="mx-auto max-w-[900px] px-6 py-16 md:py-24">
        <div className="space-y-12">
          {/* Operating Hours */}
          <div className="faq-item">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#2C2C2C] mb-4">
              Operating Hours?
            </h2>
            <div className="text-[#5A5A5A] leading-relaxed space-y-2">
              <p>Wednesday and Sunday, 5:30pm to 10:30pm.</p>
              <p>Thursday to Saturday, 5:30pm to 11:30pm.</p>
              <p className="font-medium">Closed Monday and Tuesday.</p>
            </div>
          </div>

          {/* Location */}
          <div className="faq-item">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#2C2C2C] mb-4">
              Where is Kōzo?
            </h2>
            <p className="text-[#5A5A5A] leading-relaxed">
              8500 W Sunset Blvd, West Hollywood, CA 90069.{" "}
              <a
                href="https://maps.apple.com/?address=8500%20W%20Sunset%20Blvd,%20West%20Hollywood,%20CA%2090069"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8B7355] hover:text-[#6B5335] underline underline-offset-2 transition-colors"
              >
                Get directions
              </a>{" "}
              (open Apple Maps)
            </p>
          </div>

          {/* Valet Parking */}
          <div className="faq-item">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#2C2C2C] mb-4">
              Is valet parking available?
            </h2>
            <p className="text-[#5A5A5A] leading-relaxed">
              Yes, valet parking is available at Kōzo.
            </p>
          </div>

          {/* Dress Code */}
          <div className="faq-item">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#2C2C2C] mb-4">
              What&apos;s the dress code?
            </h2>
            <p className="text-[#5A5A5A] leading-relaxed">
              Kōzo upholds a refined, upscale aesthetic, and we encourage guests to dress
              accordingly. Our dress code is smart casual. Whether joining us for a special
              occasion or an evening out, we look forward to welcoming you.
            </p>
          </div>

          {/* Large Groups */}
          <div className="faq-item">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#2C2C2C] mb-4">
              Can I reserve a table for a large group?
            </h2>
            <p className="text-[#5A5A5A] leading-relaxed">
              For parties of eight or more, please email our events team at{" "}
              <a
                href="mailto:reserve@kozousa.com"
                className="text-[#8B7355] hover:text-[#6B5335] underline underline-offset-2 transition-colors"
              >
                reserve@kozousa.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
