import type { Metadata, Viewport } from "next";
import ImageProtection from "./components/ImageProtection";
import localFont from "next/font/local";
import "./globals.css";

const BASE_URL = "https://www.kozousa.com";

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

export const viewport: Viewport = {
  themeColor: "#1a1a1a",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kozousa.com"),
  title: {
    default: "Kōzo Los Angeles | Afro-Asian Fine Dining on the Sunset Strip",
    template: "%s | Kōzo Los Angeles",
  },
  description:
    "Kōzo Los Angeles — Afro-Asian fine dining on the Sunset Strip in West Hollywood. Vibrant African flavours meet Pan-Asian precision — sushi, elevated cuisine, and warm hospitality at 8500 W Sunset Blvd.",
  keywords: [
    // Brand
    "Kōzo", "Kozo", "Kozo Los Angeles", "Kozo LA", "Kozo West Hollywood", "Kozo Sunset Strip",
    // Cuisine type
    "Afro-Asian restaurant Los Angeles", "Afro Asian restaurant LA", "African Asian fusion LA",
    "Pan-Asian cuisine Los Angeles", "Asian restaurant LA", "Asian restaurant West Hollywood",
    "African restaurant Los Angeles", "African restaurant West Hollywood",
    "sushi Los Angeles", "sushi West Hollywood", "sushi Sunset Strip", "Japanese restaurant LA",
    "fusion restaurant LA", "contemporary Asian LA",
    // Luxury / experience
    "luxury restaurant Los Angeles", "fine dining LA", "fine dining West Hollywood",
    "best restaurant Los Angeles", "best restaurant Sunset Strip",
    "upscale restaurant LA", "elegant dining West Hollywood",
    "romantic restaurant LA", "top restaurant Sunset Strip",
    // Farm to table
    "farm to table Los Angeles", "farm to table LA",
    "sustainable dining LA", "California cuisine",
    // Location
    "restaurant Sunset Strip", "Sunset Blvd restaurant", "West Hollywood dining",
    "where to eat Sunset Strip", "best restaurant West Hollywood",
  ],
  authors: [{ name: "Ramzi Yamusah", url: "https://www.kozousa.com" }],
  creator: "Kōzo",
  publisher: "Kōzo",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: "https://www.kozousa.com" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.kozousa.com",
    siteName: "Kōzo Los Angeles",
    title: "Kōzo | The Afro-Asian Experience — Sunset Strip",
    description:
      "Vibrant African flavours meet Pan-Asian precision on the Sunset Strip. Farm-to-table dining at 8500 W Sunset Blvd, West Hollywood. Opening 2025.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Kōzo Los Angeles — Afro-Asian dining experience" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kōzo | The Afro-Asian Experience — Sunset Strip",
    description: "Vibrant African flavours meet Pan-Asian precision on the Sunset Strip in West Hollywood.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${optima.variable} antialiased`}>
        <ImageProtection />
        {children}
      </body>
    </html>
  );
}
