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

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const afterAuthUrl = "/city";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${oxanium.variable} ${manrope.variable} ${cinzel.variable} h-full antialiased`}
    >
      <body
        className={`${manrope.className} flex min-h-full flex-col font-sans antialiased`}
      >
        {publishableKey ? (
          <ClerkProvider
            appearance={clerkAppearance}
            publishableKey={publishableKey}
            signInForceRedirectUrl={afterAuthUrl}
            signUpForceRedirectUrl={afterAuthUrl}
            signInFallbackRedirectUrl={afterAuthUrl}
            signUpFallbackRedirectUrl={afterAuthUrl}
            afterSignOutUrl="/"
          >
            {children}
          </ClerkProvider>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
