import Image from "next/image";
import { FaInstagram, FaFacebook } from "react-icons/fa";

/**
 * Footer — KŌZO Los Angeles
 *
 * Identical three-column layout to kozo-next's Footer.
 * Same kozo-footer__* CSS classes, same background image approach,
 * same social icon pattern (kozo-footer__icon).
 * Content updated for LA; hours left as TBC until opening.
 */
export default function Footer() {
  return (
    <footer className="kozo-footer" aria-label="Site footer">
      <Image
        src="/about.png"
        alt=""
        fill
        className="object-cover object-center"
        style={{ zIndex: 0 }}
      />

      <div className="kozo-footer__inner">

        {/* Left column */}
        <div className="kozo-footer__column">
          <h3 className="kozo-footer__heading">Contact Us</h3>
          <p className="kozo-footer__text">Los Angeles, California</p>
          <p className="kozo-footer__text">hello@kozola.com</p>
        </div>

        {/* Centre column */}
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
          <div className="kozo-footer__socials" aria-label="Social media">
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="kozo-footer__icon">
              <FaInstagram size={20} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="kozo-footer__icon">
              <FaFacebook size={20} />
            </a>
          </div>
          <p className="kozo-footer__copyright">
            &ldquo;Kōzo Hospitality Ltd&rdquo;. All Rights Reserved.
          </p>
        </div>

        {/* Right column */}
        <div className="kozo-footer__column kozo-footer__column--right">
          <h3 className="kozo-footer__heading">Opening Soon</h3>
          <p className="kozo-footer__text">
            <span className="kozo-footer__label">Afro-Asian Dining Experience</span>
            <br />
            Los Angeles, California
            <br />
            Opening Summer 2026
          </p>
        </div>

      </div>
    </footer>
  );
}
