import Image from "next/image";
import Link from "next/link";
import { FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="kozo-footer" aria-label="Site footer">
      <Image
        src="/about.webp"
        alt=""
        fill
        className="object-cover object-center"
        style={{ zIndex: 0 }}
      />
      <div className="relative z-10 mx-auto flex w-full max-w-[1120px] items-start justify-between gap-12 px-8 py-16">
        <div className="kozo-footer__column">
          <h3 className="kozo-footer__heading">Contact Us</h3>
          <p className="kozo-footer__text">
            8500 W Sunset Blvd
            <br />
            West Hollywood, CA 90069
          </p>
          <p className="kozo-footer__text">
            <a href="tel:+12137230821" style={{ color: "inherit", textDecoration: "none" }}>
              (213) 723-0821
            </a>
          </p>
          <p className="kozo-footer__text">
            <a href="mailto:info@kozousa.com" style={{ color: "inherit", textDecoration: "none" }}>
              info@kozousa.com
            </a>
          </p>
        </div>

        <div className="kozo-footer__center">
          <div className="kozo-footer__logo-wrap" aria-label="KŌZO logo">
            <Image
              src="/kozo-logo-mark.webp"
              alt="Kōzo logo mark"
              width={130}
              height={84}
              className="kozo-footer__logo-image"
            />
          </div>
          <p className="kozo-footer__copyright" style={{ marginTop: "32px" }}>
            © 2026 Kōzo Hospitality USA LLC
          </p>
          <p className="kozo-footer__text" style={{ marginTop: "12px", fontSize: "12px" }}>
            Questions? Email us at info@kozousa.com
          </p>
          <p className="kozo-footer__text" style={{ marginTop: "8px", fontSize: "12px" }}>
            <Link href="/careers" style={{ color: "inherit", textDecoration: "underline", textUnderlineOffset: "2px" }}>
              Careers
            </Link>
          </p>
        </div>

        <div className="kozo-footer__column" style={{ textAlign: "center" }}>
          <h3 className="kozo-footer__heading">Follow Us</h3>
          <div style={{ display: "flex", justifyContent: "center", gap: "22px", marginTop: "12px" }}>
            <a href="https://www.instagram.com/kozolosangeles/?hl=en" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="kozo-footer__icon">
              <FaInstagram size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
