import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Cinzel, Manrope, Oxanium } from "next/font/google";
import { clerkAppearance } from "@/lib/clerk-appearance";
import { getClerkPublishableKey } from "@/lib/clerk";
import { SfxProvider } from "@/components/SfxProvider";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getSiteUrl,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TITLE,
} from "@/lib/site";
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

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: SITE_TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: SITE_KEYWORDS,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  category: "games",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
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
        <JsonLd />
        <SfxProvider />
        {app}
      </body>
    </html>
  );
}
