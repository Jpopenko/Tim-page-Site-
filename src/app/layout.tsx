import type { Metadata, Viewport } from "next";
import { Special_Elite, Courier_Prime } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const specialElite = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const courierPrime = Courier_Prime({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-body",
});

// Update NEXT_PUBLIC_SITE_URL in .env.local (and hosting env) once domain is confirmed
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://timpage.com";
const OG_IMAGE = "https://static.wixstatic.com/media/cf7196_f030896d28ff486fb1cdeeacf32d0a22~mv2.jpeg";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Tim Page — War Photographer",
    template: "%s | Tim Page",
  },
  description:
    "Official archive and licensing portal for the photography of Tim Page (1944–2022) — Vietnam, Cambodia, Laos, Afghanistan, and beyond.",
  keywords: [
    "Tim Page", "war photographer", "Vietnam War photography",
    "photojournalism", "photo archive", "photo licensing", "combat photography",
  ],
  authors: [{ name: "Tim Page" }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Tim Page — War Photographer",
    title: "Tim Page — War Photographer",
    description:
      "Official archive and licensing portal for the photography of Tim Page (1944–2022).",
    images: [{ url: OG_IMAGE, width: 1200, height: 800, alt: "Tim Page — Vietnam, 1968" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tim Page — War Photographer",
    description:
      "Official archive and licensing portal for the photography of Tim Page (1944–2022).",
    images: [OG_IMAGE],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0d0d0c",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Tim Page",
  birthDate: "1944",
  deathDate: "2022",
  jobTitle: "War Photographer",
  nationality: "British",
  description:
    "British photojournalist renowned for his frontline coverage of the Vietnam War, Cambodia, Laos, and other conflicts from the 1960s to 2000s.",
  url: SITE_URL,
  sameAs: ["https://en.wikipedia.org/wiki/Tim_Page_(photographer)"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${specialElite.variable} ${courierPrime.variable}`}>
      <head>
        <link rel="preconnect" href="https://static.wixstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://static.wixstatic.com" />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
