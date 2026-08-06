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
  // Domain will be updated to kozola.com once confirmed
  metadataBase: new URL("https://kozola.com"),
  title: {
    default: "Kōzo Los Angeles — Coming Soon",
    template: "%s | Kōzo Los Angeles",
  },
  description:
    "Kōzo is coming to Los Angeles. The Afro-Asian dining experience — vibrant African flavours meeting Pan-Asian precision — arriving soon in LA.",
  keywords: [
    "Kōzo Los Angeles",
    "Kozo LA",
    "Afro-Asian restaurant Los Angeles",
    "fine dining Los Angeles",
    "luxury restaurant LA",
    "coming soon Los Angeles restaurant",
    "Asian African fusion LA",
    "farm to table Los Angeles",
  ],
  authors: [{ name: "Kōzo Hospitality", url: "https://kozola.com" }],
  creator: "Kōzo",
  publisher: "Kōzo",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://kozola.com" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kozola.com",
    siteName: "Kōzo Los Angeles",
    title: "Kōzo Los Angeles — Coming Soon",
    description:
      "The Afro-Asian dining experience is coming to Los Angeles. Vibrant African flavours meet Pan-Asian precision.",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Kōzo Los Angeles — Coming Soon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kōzo Los Angeles — Coming Soon",
    description:
      "The Afro-Asian dining experience is coming to Los Angeles.",
    images: ["/og-image.webp"],
  },
  icons: {
    icon: "/favicon.ico",
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
