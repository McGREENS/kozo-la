import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Story - Kōzo",
  description: "Learn about Kōzo's journey from Accra to West Hollywood's Sunset Strip.",
};

const displayFont =
  "var(--font-display), ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif";

export default function AboutPage() {
  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: "var(--kozo-cream)" }}>
      <div className="text-center px-6 py-20">
        <p
          className="text-[11px] tracking-[0.24em] uppercase mb-5"
          style={{ color: "#b89a5a" }}
        >
          Coming soon
        </p>
        <h1
          className="text-5xl md:text-7xl font-light tracking-[0.28em] text-[#1a1a1a] mb-8"
          style={{ fontFamily: displayFont }}
        >
          Our Story
        </h1>
        <p className="text-lg text-[#3a3a3a] mb-12 max-w-[500px] mx-auto leading-relaxed">
          We're crafting something special. Check back soon to learn about Kōzo's journey.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 text-[12px] tracking-[0.18em] uppercase rounded-[3px] font-semibold transition-colors"
          style={{ background: "#1b232b", color: "#F2E4B1" }}
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
