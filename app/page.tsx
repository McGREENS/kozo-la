"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaInstagram } from "react-icons/fa";

const displayFont =
  "var(--font-display), ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif";

export default function HomePage() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError("");
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/la-newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setSuccess(true);
      setForm({ name: "", email: "" });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* JSON-LD — restaurant entity for Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Restaurant",
            name: "Kōzo Los Angeles",
            url: "https://kozola.com",
            description:
              "Kōzo is coming to Los Angeles. The Afro-Asian dining experience — vibrant African flavours meeting Pan-Asian precision.",
            servesCuisine: ["Afro-Asian", "Pan-Asian", "Sushi", "Farm to Table"],
            priceRange: "$$$",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Los Angeles",
              addressRegion: "CA",
              addressCountry: "US",
            },
          }),
        }}
      />

      {/*
       * ─────────────────────────────────────────────────────────
       * PAGE SHELL
       * Three-zone layout: nav → stage → base
       *
       * Transition-readiness:
       *   - Zone 1 (.kozo-la-nav): add <Navbar /> links → set
       *     data-state="visible" on .kozo-la-nav__links to reveal them
       *   - Zone 3 (.kozo-la-base): expand into a full <Footer />
       *     by filling the left/right columns with real content
       *   No structural redesign required in either case.
       * ─────────────────────────────────────────────────────────
       */}
      <div className="kozo-la-page">

        {/* Background video with preload — z-index 0 */}
        <video
          src="/kozovideo.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          className="object-cover object-center absolute inset-0 w-full h-full"
          style={{ zIndex: 0 }}
        />

        {/* ── Zone 1: top nav bar ──────────────────────────────── */}
        <header className="kozo-la-nav">
          {/* Desktop: horizontal logo — Mobile: circular mark */}
          <a
            href="/"
            className="kozo-la-nav__logo kozo-la-animate"
            style={{ animationDelay: "0.1s" }}
            aria-label="KŌZO Los Angeles"
          >
            <Image
              src="/kozo-logo-mark.webp"
              alt="KŌZO Los Angeles"
              width={52}
              height={52}
              priority
              quality={80}
              className="kozo-la-nav__logo-mark"
            />
          </a>

          {/* Social media icons — top right */}
          <div className="kozo-la-nav__socials kozo-la-animate" style={{ animationDelay: "0.1s" }}>
            <a
              href="https://www.instagram.com/kozolosangeles/"
              className="kozo-la-nav__social-icon"
              aria-label="KŌZO Los Angeles on Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram size={15} aria-hidden="true" />
            </a>
          </div>
        </header>

        {/* ── Zone 2: centred hero stage ────────────────────────── */}
        <main className="kozo-la-stage" aria-label="KŌZO Los Angeles — Coming Soon">

          {/* Main wordmark */}
          <div
            className="kozo-la-stage__title kozo-la-animate"
            style={{ animationDelay: "0.25s" }}
          >
            <Image
              src="/KOZO_Logo_HOR_Positive_White.png"
              alt="KŌZO Los Angeles"
              width={600}
              height={120}
              priority
              quality={80}
              className="kozo-la-stage__logo"
            />
          </div>



          {/* City statement */}
          <p
            className="kozo-la-stage__statement kozo-la-animate"
            style={{ fontFamily: displayFont, animationDelay: "0.52s" }}
          >
            Los Angeles
          </p>

          {/* Opening date */}
          <p
            className="kozo-la-stage__opening kozo-la-animate"
            style={{ animationDelay: "0.65s" }}
          >
            Opening Summer 2026
          </p>

        </main>

        {/* ── Zone 3: bottom base bar ───────────────────────────── */}
        {/*
         * Transition note: when this becomes a full site, expand each
         * column into its full footer content. The grid structure
         * (left / centre / right) is already in place.
         */}
        <footer className="kozo-la-base" aria-label="Page footer">

          {/* Left — newsletter sign-up */}
          <div
            className="kozo-la-base__left kozo-la-animate"
            style={{ animationDelay: "0.90s" }}
          >
            <p className="kozo-la-base__label" id="newsletter-label">
              Be the first to know
            </p>

            {success ? (
              <div className="kozo-la-success" role="status" aria-live="polite">
                <p
                  className="kozo-la-success__title"
                  style={{ fontFamily: displayFont }}
                >
                  You&apos;re on the list.
                </p>
                <p className="kozo-la-success__body">
                  We&apos;ll be in touch as we approach opening.
                </p>
              </div>
            ) : (
              <form
                className="kozo-la-form"
                onSubmit={handleSubmit}
                noValidate
                aria-labelledby="newsletter-label"
              >
                <div className="kozo-la-form__row">
                  <input
                    className="kozo-la-input"
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                    aria-label="Your name"
                  />
                  <input
                    className="kozo-la-input"
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                    aria-label="Your email address"
                  />
                  <button
                    className="kozo-la-submit"
                    type="submit"
                    disabled={loading}
                    aria-busy={loading}
                  >
                    {loading ? "…" : "Notify Me"}
                  </button>
                </div>

                {error && (
                  <p className="kozo-la-error" role="alert" aria-live="assertive">
                    {error}
                  </p>
                )}
              </form>
            )}
          </div>

          {/* Centre — social icons + copyright + email + address */}
          <div
            className="kozo-la-base__centre kozo-la-animate"
            style={{ animationDelay: "1.0s" }}
          >
            <p className="kozo-la-base__copy">
              &copy; {new Date().getFullYear()} Kōzo Hospitality USA LLC.
            </p>
            <p className="kozo-la-base__copy" style={{ marginTop: "8px", fontSize: "11px" }}>
              Questions? Email us at{" "}
              <a 
                href="mailto:info@kozousa.com"
                style={{ color: "#F2E4B1", textDecoration: "none" }}
              >
                info@kozousa.com
              </a>
            </p>
            <p className="kozo-la-base__copy" style={{ marginTop: "12px", fontSize: "11px", lineHeight: "1.6" }}>
              8500 W Sunset Blvd<br />
              West Hollywood, CA 90069
            </p>
          </div>

          {/* Right — careers */}
          <div
            className="kozo-la-base__right kozo-la-animate"
            style={{ animationDelay: "1.1s" }}
          >
            <p className="kozo-la-careers__eyebrow">Join the team</p>
            <p
              className="kozo-la-careers__heading"
              style={{ fontFamily: displayFont }}
            >
              We&apos;re building something extraordinary in LA.
            </p>
            <Link
              href="/careers"
              className="kozo-la-careers__cta"
              aria-label="Express interest in joining KŌZO Los Angeles"
            >
              Careers
            </Link>
          </div>

        </footer>
      </div>
    </>
  );
}
