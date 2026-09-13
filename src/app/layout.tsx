import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Cinzel, Manrope, Oxanium } from "next/font/google";
import { clerkAppearance } from "@/lib/clerk-appearance";
import { getClerkPublishableKey } from "@/lib/clerk";
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

/** Must be NEXT_PUBLIC_… — only that is inlined into the client + build for Clerk UI. */
const publishableKey = getClerkPublishableKey();
const afterAuthUrl = "/city";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const app = publishableKey ? (
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
  );

  return (
    <html
      lang="en"
      className={`${oxanium.variable} ${manrope.variable} ${cinzel.variable} h-full antialiased`}
    >
      <body className={`${manrope.className} flex min-h-full flex-col font-sans antialiased`}>
        {app}
      </body>
    </html>
  );
}
