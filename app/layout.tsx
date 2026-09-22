import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Readiness Check | Himat Technology",
  description:
    "Analyze any website for AI search readiness. Built by Himat Technology — contact info@himat.co.in or visit himat.co.in.",
  keywords: [
    "AI readiness",
    "Himat Technology",
    "AI SEO",
    "GPTBot",
    "structured data",
    "robots.txt",
    "AI crawlers",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sourceSans.variable} ${fraunces.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
