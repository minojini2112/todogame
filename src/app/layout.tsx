import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Cinzel, Manrope, Oxanium } from "next/font/google";
import { clerkAppearance } from "@/lib/clerk-appearance";
import "./globals.css";

const oxanium = Oxanium({
  variable: "--font-oxanium",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-splash",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EchoBound",
    template: "%s · EchoBound",
  },
  description:
    "A gamified life RPG. Wake in ruined Aurelia, bind with Skyform, and restore the last city through real-world quests.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html
        lang="en"
        className={`${oxanium.variable} ${manrope.variable} ${cinzel.variable} h-full antialiased`}
      >
        <body
          className={`${manrope.className} flex min-h-full flex-col font-sans antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
