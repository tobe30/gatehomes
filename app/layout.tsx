import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gatehomesbooking.com"),
  title: "Gate Homes | Lagos Homes, Properties & Shortlets",
  description:
    "Explore homes, apartments and shortlets across Lagos for sale, rent or stay. Browse Gate Homes listings and contact our team.",
  openGraph: {
    type: "website",
    url: "https://gatehomesbooking.com/",
    siteName: "Gate Homes",
    title: "Gate Homes | Lagos Homes, Properties & Shortlets",
    description:
      "Explore homes, apartments and shortlets across Lagos for sale, rent or stay.",
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gate Homes | Lagos Homes, Properties & Shortlets",
    description:
      "Explore homes, apartments and shortlets across Lagos for sale, rent or stay.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <SiteChrome>{children}</SiteChrome>
        </Suspense>
      </body>
    </html>
  );
}
