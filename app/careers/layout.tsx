import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join the Kōzo Los Angeles team. We're building something extraordinary and looking for passionate hospitality professionals. Apply today.",
  alternates: { canonical: "https://kozola.com/careers" },
  openGraph: {
    url: "https://kozola.com/careers",
    title: "Careers at Kōzo Los Angeles",
    description:
      "Join our team. Be part of something extraordinary at Kōzo Los Angeles.",
  },
};

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
