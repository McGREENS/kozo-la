"use client";

const displayFont =
  "var(--font-display), ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif";

export default function EventsSection() {
  return (
    <section style={{ background: "#05060c" }} aria-labelledby="kozo-events-heading">
      <div className="mx-auto max-w-[760px] px-8 py-24 text-center">
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
          className="text-[14px] leading-[1.85] tracking-wide mx-auto max-w-[520px] mb-4"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          From a birthday dinner around one table to a private reception or a full restaurant buyout, we&apos;ll work with you on the right space, food and drinks for the occasion.
        </p>
        <p
          className="text-[14px] leading-[1.85] tracking-wide mx-auto max-w-[520px] mb-10"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          For parties of 8 or more, please book through our events team using the enquiry link below.
        </p>
        <a
          href="mailto:reserve@kozousa.com"
          className="inline-block px-10 py-4 text-[12px] tracking-[0.18em] uppercase rounded-[3px] font-semibold transition-colors"
          style={{ background: "#F2E4B1", color: "#1b232b" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#F0C2B2")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#F2E4B1")}
        >
          Enquire About an Event
        </a>
      </div>
    </section>
  );
}
