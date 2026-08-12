import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers | Kōzo Los Angeles",
  description:
    "Join the Kōzo Los Angeles team. We're hiring passionate hospitality professionals for our Afro-Asian fine dining restaurant opening Summer 2026. Positions include chefs, managers, sommeliers, and more.",
  keywords: [
    "Kōzo Los Angeles careers",
    "restaurant jobs Los Angeles",
    "chef jobs LA",
    "hospitality jobs Los Angeles",
    "fine dining careers",
    "Kōzo jobs",
    "sommelier jobs Los Angeles",
    "culinary careers",
  ],
  openGraph: {
    title: "Careers at Kōzo Los Angeles",
    description:
      "Join our team. We're hiring experienced hospitality professionals for our LA opening.",
    type: "website",
    url: "https://kozousa.com/careers",
    siteName: "Kōzo Los Angeles",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Careers at Kōzo Los Angeles",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Join the Kōzo Los Angeles Team",
    description:
      "We're hiring passionate hospitality professionals for our LA opening.",
    creator: "@kozolosangeles",
  },
};

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
