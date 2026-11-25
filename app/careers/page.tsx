"use client";

import { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const displayFont =
  "var(--font-display), ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif";

const openPositions = [
  {
    title: "Head Sushi Chef",
    type: "Full-time",
    location: "West Hollywood, CA",
    description:
      "We are looking for an experienced Sushi Chef to lead our Japanese kitchen. You will craft exceptional sushi and omakase experiences for our guests.",
  },
  {
    title: "Floor Manager",
    type: "Full-time",
    location: "West Hollywood, CA",
    description:
      "Lead our front-of-house team to deliver the elevated Kōzo dining experience. You will oversee service standards, staff training and guest satisfaction.",
  },
];

export default function CareersPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/careers", {
        method: "POST",
        body: formData,
      });

      setLoading(false);

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSuccess(true);
      form.reset();
      setFileName("No file chosen");
    } catch (err) {
      setLoading(false);
      setError("Network error. Please try again.");
    }
  }

  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section className="careers-hero">
        <div className="careers-hero__overlay" />
        <div className="careers-hero__inner">
          <div className="careers-hero__left">
            <p className="about-eyebrow">Join our Team</p>
            <h1 className="contact-hero__title" style={{ fontFamily: displayFont }}>
              We are always on the lookout for likeminded
              <br />
              professionals to join our team.
            </h1>

            <form className="contact-form" onSubmit={handleSubmit}>
              <input className="contact-input" type="text" name="name" placeholder="Name" required />
              <input className="contact-input" type="email" name="email" placeholder="Email" required />
              <textarea className="contact-input contact-textarea" name="message" placeholder="Message" required />

              <p className="careers-cv-note">
                If you are passionate about hospitality, ambitious about progression
                and want to be a part of a winning team, please submit your CV.
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
                  name="file"
                  accept=".pdf"
                  className="sr-only"
                  onChange={(e) =>
                    setFileName(e.target.files?.[0]?.name ?? "No file chosen")
                  }
                />
              </div>

              {error && (
                <p className="text-[12px] px-3 py-2 rounded-[3px]" style={{ color: "#f87171", background: "rgba(248,113,113,0.08)" }}>
                  {error}
                </p>
              )}

              {success && (
                <div
                  className="rounded-[4px] px-6 py-4 mb-4"
                  style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)" }}
                >
                  <p className="text-[14px]" style={{ color: "#22c55e" }}>
                    Application submitted successfully! We'll review your application and get back to you soon.
                  </p>
                </div>
              )}

              <button className="contact-submit" type="submit" disabled={loading}>
                {loading ? "Submitting…" : "Submit"}
              </button>
            </form>
          </div>

          <div className="careers-hero__right">
            <p className="contact-quote" style={{ fontFamily: displayFont }}>
              Be part of something extraordinary.
            </p>
            <div className="contact-info">
              <div className="contact-info__block">
                <p className="contact-info__label">Location</p>
                <p className="contact-info__value">8500 W Sunset Blvd<br />West Hollywood, CA 90069</p>
              </div>
              <div className="contact-info__block">
                <p className="contact-info__label">Email</p>
                <p className="contact-info__value">
                  <a href="mailto:info@kozousa.com" style={{ color: "inherit", textDecoration: "none" }}>
                    info@kozousa.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      <Footer />
    </div>
  );
}
