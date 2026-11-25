"use client";

import { useState } from "react";
import Image from "next/image";

const displayFont =
  "var(--font-display), ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif";

export default function EventsSection() {
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    guests: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/private-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", phone: "", date: "", guests: "", message: "" });
        setTimeout(() => {
          setFormOpen(false);
          setSubmitted(false);
        }, 3000);
      }
    } catch (err) {
      console.error("Form submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section id="private-events" style={{ background: "#05060c" }} aria-labelledby="kozo-events-heading">
        <div className="mx-auto max-w-[1120px] px-8 py-24">
          <div className="text-center mb-16">
            <p
              className="text-[12px] tracking-[0.22em] uppercase mb-4"
              style={{ color: "#b89a5a" }}
            >
              Private Events &amp; Venue Hire
            </p>
            <h2
              id="kozo-events-heading"
              className="text-[clamp(34px,4vw,58px)] font-normal leading-[1.08] tracking-wide text-white mb-6"
              style={{ fontFamily: displayFont }}
            >
              Bring your people to Kōzo
            </h2>
            <p
              className="text-[14px] leading-[1.85] tracking-wide mx-auto max-w-[600px] mb-4"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              From a birthday dinner around one table to a private reception or a full restaurant buyout, we&apos;ll work with you on the right space, food and drinks for the occasion.
            </p>
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16 max-w-[900px] mx-auto">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[4px]">
              <Image 
                src="/space1.jpg" 
                alt="Kōzo dining space" 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 300px"
              />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-[4px]">
              <Image 
                src="/space2.jpg" 
                alt="Kōzo private dining" 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 300px"
              />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-[4px]">
              <Image 
                src="/space3.jpg" 
                alt="Kōzo event space" 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 300px"
              />
            </div>
          </div>

          <div className="text-center">
            <p
              className="text-[14px] leading-[1.85] tracking-wide mx-auto max-w-[520px] mb-10"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              For parties of 8 or more, please submit an inquiry below.
            </p>
            <button
              onClick={() => setFormOpen(true)}
              className="inline-block px-10 py-4 text-[12px] tracking-[0.18em] uppercase rounded-[3px] font-semibold transition-colors border-none cursor-pointer"
              style={{ background: "#F2E4B1", color: "#1b232b" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F0C2B2")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#F2E4B1")}
            >
              Enquire About an Event
            </button>
          </div>
        </div>
      </section>

      {/* Inquiry Form Modal */}
      {formOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.85)" }}
          onClick={() => setFormOpen(false)}
        >
          <div 
            className="relative bg-white rounded-[4px] w-full max-w-[600px] p-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setFormOpen(false)}
              className="absolute top-4 right-4 text-2xl text-black/50 hover:text-black transition-colors bg-transparent border-none cursor-pointer"
              aria-label="Close"
            >
              ×
            </button>

            <h3 
              className="text-3xl font-normal mb-2 text-[#1b232b]"
              style={{ fontFamily: displayFont }}
            >
              Private Event Inquiry
            </h3>
            <p className="text-sm text-black/60 mb-6">
              Tell us about your event and we&apos;ll get back to you soon.
            </p>

            {submitted ? (
              <div className="text-center py-12">
                <p className="text-xl text-green-700 mb-2">✓ Inquiry Submitted!</p>
                <p className="text-black/60">We&apos;ll be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-black/80 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 text-base border border-black/30 rounded-[3px] focus:outline-none focus:border-[#b89a5a] focus:ring-1 focus:ring-[#b89a5a]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black/80 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 text-base border border-black/30 rounded-[3px] focus:outline-none focus:border-[#b89a5a] focus:ring-1 focus:ring-[#b89a5a]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black/80 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 text-base border border-black/30 rounded-[3px] focus:outline-none focus:border-[#b89a5a] focus:ring-1 focus:ring-[#b89a5a]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-black/80 mb-2">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full px-4 py-3 text-base border border-black/30 rounded-[3px] focus:outline-none focus:border-[#b89a5a] focus:ring-1 focus:ring-[#b89a5a]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-black/80 mb-2">
                      Number of Guests
                    </label>
                    <input
                      type="number"
                      min="8"
                      value={formData.guests}
                      onChange={(e) => setFormData({...formData, guests: e.target.value})}
                      className="w-full px-4 py-3 text-base border border-black/30 rounded-[3px] focus:outline-none focus:border-[#b89a5a] focus:ring-1 focus:ring-[#b89a5a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black/80 mb-2">
                    Event Details
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 text-base border border-black/30 rounded-[3px] focus:outline-none focus:border-[#b89a5a] focus:ring-1 focus:ring-[#b89a5a] resize-none"
                    placeholder="Tell us about your event..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-10 py-4 text-[12px] tracking-[0.18em] uppercase rounded-[3px] font-semibold transition-colors border-none cursor-pointer"
                  style={{ background: submitting ? "#ccc" : "#1b232b", color: "#F2E4B1" }}
                >
                  {submitting ? "Submitting..." : "Submit Inquiry"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
