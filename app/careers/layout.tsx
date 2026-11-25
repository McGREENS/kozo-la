import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join the Kōzo Los Angeles team on the Sunset Strip. We're hiring passionate hospitality professionals. View open positions and apply today.",
  alternates: { canonical: "https://www.kozousa.com/careers" },
  openGraph: {
    url: "https://www.kozousa.com/careers",
    title: "Careers at Kōzo Los Angeles",
    description: "Join our team. View open positions at Kōzo Los Angeles and apply today.",
  },
};

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
