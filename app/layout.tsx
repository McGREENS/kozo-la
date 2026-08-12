import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import ImageProtection from "./components/ImageProtection";
import "./globals.css";

/* ── Optima — same loading approach as kozo-next ─────────────── */
const optima = localFont({
  src: [
    {
      path: "./fonts/Optima.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Optima.woff",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-optima",
  display: "swap",
});

/* ── Viewport ────────────────────────────────────────────────── */
export const viewport: Viewport = {
  themeColor: "#0b0b0b",
};

/* ── Root metadata ───────────────────────────────────────────── */
export const metadata: Metadata = {
  metadataBase: new URL("https://kozola.com"),
  title: {
    default: "Kōzo Los Angeles — Afro-Asian Dining Experience Opening Summer 2026",
    template: "%s | Kōzo Los Angeles",
  },
  description:
    "Kōzo Los Angeles is an Afro-Asian fine dining restaurant coming to Los Angeles in Summer 2026. Experience vibrant African flavours meeting Pan-Asian precision. Careers now open.",
  keywords: [
    "Kōzo Los Angeles",
    "Kozo LA",
    "Afro-Asian restaurant Los Angeles",
    "Pan-Asian restaurant LA",
    "fine dining Los Angeles",
    "luxury restaurant LA",
    "coming soon Los Angeles restaurant",
    "Asian African fusion",
    "farm to table Los Angeles",
    "high-end dining California",
    "Afro-Asian cuisine",
    "restaurant jobs Los Angeles",
  ],
  authors: [{ name: "Kōzo Hospitality", url: "https://kozola.com" }],
  creator: "Kōzo Hospitality",
  publisher: "Kōzo Hospitality",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://kozola.com",
  },
  verification: {
    google: "BX4iPAsfnQttyY3NO7ZiXgo7gN1cC6l9TVnkyLj0gmg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kozola.com",
    siteName: "Kōzo Los Angeles",
    title: "Kōzo Los Angeles — Afro-Asian Dining Experience",
    description:
      "Vibrant African flavours meet Pan-Asian precision. Opening Summer 2026 in Los Angeles.",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Kōzo Los Angeles — Afro-Asian fine dining",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kōzo Los Angeles — Afro-Asian Dining",
    description:
      "Vibrant African flavours meet Pan-Asian precision. Coming Summer 2026.",
    images: ["/og-image.webp"],
    creator: "@kozolosangeles",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${optima.variable} antialiased`}>
        <ImageProtection />
        {children}
      </body>
    </html>
  );
}
