"use client";

import { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/**
 * Careers page — KŌZO Los Angeles
 *
 * Exact structural and visual copy of the Kigali careers page.
 * Same CSS classes (careers-hero, careers-hero__overlay,
 * careers-hero__inner, contact-form, contact-input, etc.),
 * same two-column hero layout (form left, quote + info right),
 * same open positions grid below.
 *
 * Functional differences from Kigali:
 *   - Form submits to /api/careers (multipart, stores in la_careers table)
 *   - Location details updated for LA
 *   - Open positions updated for LA opening team
 */

const displayFont =
  "var(--font-display), ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif";

const openPositions = [
  {
    title: "Head Sushi Chef",
    type: "Full-time",
    location: "Los Angeles, CA",
    description:
      "We are looking for an experienced Sushi Chef to lead our Japanese kitchen. You will craft exceptional sushi and omakase experiences, setting the standard for our LA opening.",
  },
  {
    title: "Floor Manager",
    type: "Full-time",
    location: "Los Angeles, CA",
    description:
      "Lead our front-of-house team to deliver the elevated Kōzo dining experience. You will oversee service standards, staff training, and guest satisfaction from day one.",
  },
  {
    title: "Sous Chef — Afro-Asian Kitchen",
    type: "Full-time",
    location: "Los Angeles, CA",
    description:
      "Support our Head Chef in delivering a farm-to-table Afro-Asian menu. A passion for bold flavours, clean technique, and cultural curiosity is essential.",
  },
  {
    title: "Sommelier / Beverage Manager",
    type: "Full-time",
    location: "Los Angeles, CA",
    description:
      "Curate and manage our beverage programme — wine, cocktails, and non-alcoholic offerings. You will train the team and create pairings that complement our Afro-Asian menu.",
  },
];

export default function CareersPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("No file chosen");

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setError("");
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("email", form.email);
      fd.append("message", form.message);
      const file = fileInputRef.current?.files?.[0];
      if (file) fd.append("cv", file);

      const res = await fetch("/api/careers", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Navbar />

      {/* ── Hero — full-screen background, two-column form layout ── */}
      {/*
       * Exact same structure as kozo-next careers:
       * .careers-hero > .careers-hero__overlay + .careers-hero__inner
       *   > .careers-hero__left (form) + .careers-hero__right (quote/info)
       */}
      <section className="careers-hero">
        <div className="careers-hero__overlay" />

        <div className="careers-hero__inner">

          {/* ── Left: application form ─────────────────────────── */}
          <div className="careers-hero__left">
            <p className="about-eyebrow">Join our Team</p>

            <h1
              className="contact-hero__title"
              style={{ fontFamily: displayFont }}
            >
              We are always on the lookout for likeminded
              <br />
              professionals to join our team.
            </h1>

            {success ? (
              /* ── Success message ──────────────────────────── */
              <div
                className="careers-success"
                role="status"
                aria-live="polite"
              >
                <p
                  className="careers-success__title"
                  style={{ fontFamily: displayFont }}
                >
                  Application received.
                </p>
                <p className="careers-success__body">
                  Thank you for your interest in Kōzo Los Angeles. We&apos;ll
                  be in touch if your profile matches one of our openings.
                </p>
              </div>
            ) : (
              /* ── Application form ─────────────────────────── */
              <form
                className="contact-form"
                onSubmit={handleSubmit}
                noValidate
                aria-label="Career application form"
              >
                <input
                  className="contact-input"
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
                  className="contact-input"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                  aria-label="Your email address"
                />
                <textarea
                  className="contact-input contact-textarea"
                  name="message"
                  placeholder="Tell us about yourself and the role you are interested in"
                  value={form.message}
                  onChange={handleChange}
                  aria-label="Your message"
                />

                <p className="careers-cv-note">
                  If you are passionate about hospitality, ambitious about
                  progression and want to be part of a winning team, please
                  attach your CV.
                </p>

                <div className="careers-file-row">
                  <button
                    type="button"
                    className="careers-file-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Attach PDF
                  </button>
                  <span className="careers-file-name">{fileName}</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    className="sr-only"
                    aria-label="Attach your CV as a PDF"
                    onChange={(e) =>
                      setFileName(e.target.files?.[0]?.name ?? "No file chosen")
                    }
                  />
                </div>

                {error && (
                  <p
                    className="careers-form-error"
                    role="alert"
                    aria-live="assertive"
                  >
                    {error}
                  </p>
                )}

                <button
                  className="contact-submit"
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                >
                  {loading ? "Submitting…" : "Submit"}
                </button>
              </form>
            )}
          </div>

          {/* ── Right: quote + contact email ────────────────── */}
          <div className="careers-hero__right">
            <p
              className="contact-quote"
              style={{ fontFamily: displayFont }}
            >
              Be part of something extraordinary.
            </p>
            <div className="contact-info">
              <div className="contact-info__block">
                <p className="contact-info__label">For career inquiries</p>
                <a 
                  href="mailto:Careers@kozousa.com" 
                  className="contact-info__value"
                  style={{ textDecoration: "none", cursor: "pointer" }}
                >
                  Careers@kozousa.com
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Open Positions ───────────────────────────────────── */}
      

      <Footer />
    </div>
  );
}
