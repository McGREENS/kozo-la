"use client";

import { useState } from "react";
import Image from "next/image";
import MenuModal from "./MenuModal";

const displayFont =
  "var(--font-display), ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif";

const ctaButton =
  "mt-8 rounded-[3px] bg-[#1b232b] px-6 py-3 text-[12px] font-semibold tracking-[0.18em] uppercase text-[#F2E4B1] transition hover:bg-[#38434a]";
const ctaStyle = { fontFamily: "inherit", cursor: "pointer", border: "none" } as const;
const bodyText =
  "text-[14px] leading-[1.85] tracking-[0.02em] text-[#2a3640]";

export default function MenuSection() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Food & Drinks on cream */}
      <section className="kozo-menu" aria-label="Food and Drinks">
        <div className="mx-auto max-w-[1120px] px-8 py-20">
          {/* Food — text left, image right */}
          <div className="flex flex-col md:flex-row gap-10 md:gap-14 items-center">
            <div className="w-full md:w-1/2 md:pr-6">
              <h2
                className="kozo-menu__title"
                style={{ fontFamily: displayFont, textAlign: "left" }}
              >
                Food
              </h2>
              <p className={bodyText}>
                At Kōzo, African ingredients meet Asian techniques. We take a
                farm-to-table approach, letting what&apos;s in season from local
                farms guide what we cook. You&apos;ll find the warmth of suya,
                the heat of Akabanga chilli oil and the smoke of the robata
                alongside sushi and sashimi.
              </p>
              
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className={ctaButton}
                style={ctaStyle}
              >
                View Food Menu
              </button>
            </div>
            <div className="w-full md:w-1/2">
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative overflow-hidden aspect-[3/4]" style={{ background: "#000" }}>
                    <Image src="/FOOD101.jpg" alt="Kōzo food" fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover" />
                  </div>
                  <div className="relative overflow-hidden aspect-[3/4]" style={{ background: "#000" }}>
                    <Image src="/FOOD202.jpg" alt="Kōzo food" fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Drinks — image left, text right (alternating) */}
          <div className="flex flex-col md:flex-row-reverse gap-10 md:gap-14 items-center mt-20 md:mt-28">
            <div className="w-full md:w-1/2 md:pl-6">
              <h2
                className="kozo-menu__title"
                style={{ fontFamily: displayFont, textAlign: "left" }}
              >
                Drinks
              </h2>
              <p className={bodyText}>
                Our cocktail menu tells another part of the Kōzo story. African
                spices are the starting point, layered with bright citrus and
                fragrant botanicals. That balance makes the cocktails just as
                good on their own as they are alongside something hot off the
                robata.
              </p>
              <p className={`${bodyText} mt-5`}>
                Discover our wine and sake list, carefully curated to complement the
                 dishes at Kōzo. Enjoy a glass, a carafe or a bottle for the table.
              </p>
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className={ctaButton}
                style={ctaStyle}
              >
                View Drinks Menu
              </button>
            </div>
            <div className="w-full md:w-1/2">
              <div className="grid grid-cols-2 gap-2">
                <div className="relative overflow-hidden aspect-[3/4]" style={{ background: "#000" }}>
                  <Image src="/drink10.jpg" alt="Kōzo cocktail" fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover" />
                </div>
                <div className="relative overflow-hidden aspect-[3/4]" style={{ background: "#000" }}>
                  <Image src="/KOZO_02810.jpg" alt="Kōzo drinks" fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Embār — coming soon, dark */}
      <section style={{ background: "#F0C2B2" }} aria-labelledby="kozo-embar-heading">
        <div className="mx-auto max-w-[760px] px-8 py-24 text-center">
          <p
            className="text-[11px] tracking-[0.24em] uppercase mb-5"
            style={{ color: "#b89a5a" }}
          >
            Coming soon
          </p>
          <h2
            id="kozo-embar-heading"
            className="font-normal leading-[1.1] mb-6"
            style={{ fontFamily: displayFont, fontSize: "clamp(34px,4vw,58px)", color: "#1b232b" }}
          >
            Embār
          </h2>
          <p
            className="text-[14px] leading-[1.85] tracking-[0.02em]"
            style={{ color: "rgba(0,0,0,0.72)" }}
          >
            Embār is Kōzo LA&apos;s intimate cocktail bar on the Sunset Strip.
            House-made ferments and tonics bring out the flavours of African
            spices and botanicals, while a high-fidelity sound system gives the
            music as much presence as the drinks.
          </p>
          
        </div>
      </section>

      {menuOpen && <MenuModal onClose={() => setMenuOpen(false)} />}
    </>
  );
}
