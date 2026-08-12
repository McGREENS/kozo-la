"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const displayFont =
  "var(--font-display), ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className={`kozo-navbar${scrolled ? " kozo-navbar--scrolled" : ""}${open ? " kozo-navbar--open" : ""}`}>
        <div className="kozo-navbar__inner">

          {/* Left links */}
          <nav className="kozo-navbar__links kozo-navbar__links--left" aria-label="Left navigation">
            <Link href="/" className="kozo-navbar__link">Home</Link>
          </nav>

          {/* Centred logo */}
          <Link
            href="/"
            className="kozo-navbar__logo"
            aria-label="KŌZO Los Angeles — Home"
          >
            <Image
              src="/KOZO_Logo_HOR_Positive_White.png"
              alt="KŌZO Los Angeles"
              width={110}
              height={36}
              priority
              quality={80}
              style={{ width: "auto", height: "32px" }}
            />
          </Link>

          {/* Right links */}
          <nav className="kozo-navbar__links kozo-navbar__links--right" aria-label="Right navigation">
            <Link href="/careers" className="kozo-navbar__link">Careers</Link>
          </nav>

          {/* Hamburger — mobile only */}
          <button
            className="kozo-navbar__hamburger"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span className={`kozo-navbar__bar${open ? " kozo-navbar__bar--top" : ""}`} />
            <span className={`kozo-navbar__bar${open ? " kozo-navbar__bar--mid" : ""}`} />
            <span className={`kozo-navbar__bar${open ? " kozo-navbar__bar--bot" : ""}`} />
          </button>

        </div>
      </header>

      {/* Mobile overlay */}
      {open && (
        <div
          className="kozo-navbar__mobile-overlay"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          <Link href="/" className="kozo-navbar__mobile-link" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/careers" className="kozo-navbar__mobile-link" onClick={() => setOpen(false)}>Careers</Link>
        </div>
      )}
    </>
  );
}
