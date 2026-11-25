"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import BookingWidget from "./BookingWidget";

const displayFont =
  "var(--font-display), ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuDropdownOpen, setMenuDropdownOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close menu on route change / resize
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMenuDropdownOpen(false);
      }
    };

    if (menuDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuDropdownOpen]);

  const linkClass = `hover:opacity-100 transition-opacity`;

  const scrollToStory = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('our-story');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If not on homepage, navigate to homepage with hash
      window.location.href = '/#our-story';
    }
  };

  const scrollToEvents = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('private-events');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If not on homepage, navigate to homepage with hash
      window.location.href = '/#private-events';
    }
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled || open ? "bg-white shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1120px] items-center justify-between px-6 py-5">
          {/* Left nav — hidden on mobile */}
          <nav
            className={`hidden md:flex items-center gap-10 text-[12px] font-medium tracking-wide transition-colors duration-300 ${
              scrolled ? "text-black/70" : "text-white opacity-90"
            }`}
          >
            <div className="relative" ref={dropdownRef}>
              <button 
                className={`${linkClass} bg-transparent border-none cursor-pointer`} 
                style={{ fontFamily: "inherit", fontSize: "inherit", letterSpacing: "inherit", fontWeight: "inherit" }} 
                onClick={() => setMenuDropdownOpen(!menuDropdownOpen)}
              >
                Food & Drink {menuDropdownOpen ? '▴' : '▾'}
              </button>
              {menuDropdownOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-[3px] py-2 min-w-[160px] z-50"
                  style={{ border: '1px solid rgba(0,0,0,0.1)' }}
                >
                  <a
                    href="/menus/menu-food.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-[12px] text-black/70 hover:bg-gray-50 transition-colors"
                  >
                    Food Menu
                  </a>
                  <a
                    href="/menus/menu-drinks.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-[12px] text-black/70 hover:bg-gray-50 transition-colors"
                  >
                    Drinks Menu
                  </a>
                  <a
                    href="/menus/menu-wine.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-[12px] text-black/70 hover:bg-gray-50 transition-colors"
                  >
                    Wine Menu
                  </a>
                </div>
              )}
            </div>
            <button className={`${linkClass} bg-transparent border-none cursor-pointer`} style={{ fontFamily: "inherit", fontSize: "inherit", letterSpacing: "inherit", fontWeight: "inherit" }} onClick={scrollToStory}>Our Story</button>
            <button className={`${linkClass} bg-transparent border-none cursor-pointer`} style={{ fontFamily: "inherit", fontSize: "inherit", letterSpacing: "inherit", fontWeight: "inherit" }} onClick={scrollToEvents}>Private Events</button>
          </nav>

          {/* Logo */}
          <Link
            href="/"
            className={`select-none text-[28px] md:text-[32px] font-medium tracking-[0.28em] transition-colors duration-300 ${
              scrolled || open ? "text-black" : "text-white"
            }`}
            style={{
              fontFamily: displayFont,
              textShadow: scrolled || open ? "none" : "0 2px 16px rgba(0,0,0,0.35)",
            }}
          >
            KŌZO
          </Link>

          {/* Right nav — hidden on mobile */}
          <div
            className={`hidden md:flex items-center gap-10 text-[12px] font-medium tracking-wide transition-colors duration-300 ${
              scrolled ? "text-black/70" : "text-white/90"
            }`}
          >
            <Link className={linkClass} href="/faqs">FAQs</Link>
            <button
              onClick={() => setBookingOpen(true)}
              className="rounded-[3px] bg-[#F2E4B1] px-4 py-2 text-[12px] font-semibold tracking-wide text-black/80 shadow-[0_6px_18px_rgba(0,0,0,0.28)] transition hover:bg-[#F0C2B2] border-none cursor-pointer"
              style={{ fontFamily: "inherit" }}
            >
              Book a Table
            </button>
          </div>

          {/* Hamburger — mobile only */}
          <button
            className={`md:hidden flex flex-col justify-center gap-[5px] w-8 h-8 ${
              scrolled || open ? "text-black" : "text-white"
            }`}
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span className={`block h-[1.5px] w-full bg-current transition-transform duration-300 origin-center ${open ? "rotate-45 translate-y-[6.5px]" : ""}`} />
            <span className={`block h-[1.5px] w-full bg-current transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
            <span className={`block h-[1.5px] w-full bg-current transition-transform duration-300 origin-center ${open ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-white flex flex-col items-center justify-center gap-8 text-[18px] font-medium tracking-wide text-black/80"
          onClick={() => setOpen(false)}
        >
          <div className="flex flex-col items-center gap-4">
            <p className="text-[14px] text-black/50 uppercase tracking-wider">Menus</p>
            <a
              href="/menus/menu-food.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black/80"
            >
              Food Menu
            </a>
            <a
              href="/menus/menu-drinks.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black/80"
            >
              Drinks Menu
            </a>
            <a
              href="/menus/menu-wine.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black/80"
            >
              Wine Menu
            </a>
          </div>
          <button onClick={(e) => { setOpen(false); scrollToStory(e); }} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "inherit", letterSpacing: "inherit", fontWeight: "inherit" }} className="text-black/80">Our Story</button>
          <button onClick={(e) => { setOpen(false); scrollToEvents(e); }} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "inherit", letterSpacing: "inherit", fontWeight: "inherit" }} className="text-black/80">Private Events</button>
          <Link href="/faqs" onClick={() => setOpen(false)}>FAQs</Link>
          <button
            onClick={() => { setOpen(false); setBookingOpen(true); }}
            className="mt-4 rounded-[3px] bg-[#F2E4B1] px-6 py-3 text-[13px] font-semibold tracking-wide text-black/80 transition hover:bg-[#F0C2B2] border-none cursor-pointer"
            style={{ fontFamily: "inherit" }}
          >
            Book a Table
          </button>
        </div>
      )}
      {bookingOpen && <BookingWidget onClose={() => setBookingOpen(false)} />}
    </>
  );
}
