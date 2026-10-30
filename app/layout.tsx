import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gate Homes Booking",
  description: "Find homes, apartments, and stays across Lagos with Gate Homes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteChrome>{children}</SiteChrome>
        </body>
    </html>
  );
}
