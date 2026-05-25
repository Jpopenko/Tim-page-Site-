import type { Metadata } from "next";
import { Special_Elite, Courier_Prime } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Tim Page — War Photographer",
  description:
    "The archive and licensing portal for the photography of Tim Page — Vietnam, Cambodia, and beyond.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${specialElite.variable} ${courierPrime.variable}`}>
      <body>{children}</body>
    </html>
  );
}
