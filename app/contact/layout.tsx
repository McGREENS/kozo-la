import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Kōzo Los Angeles. Visit us at 8500 W Sunset Blvd, West Hollywood or email info@kozousa.com.",
  alternates: { canonical: "https://www.kozousa.com/contact" },
  openGraph: {
    url: "https://www.kozousa.com/contact",
    title: "Contact Kōzo Los Angeles",
    description: "Reach out to Kōzo at 8500 W Sunset Blvd, West Hollywood. Email info@kozousa.com.",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
