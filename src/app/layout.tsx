import type { Metadata } from "next";
import { Manrope, Orbitron } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EchoBound — The Last City",
  description:
    "Wake in ruined Aurelia. Bind your Skyform. Restore the city through real-world quests.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${orbitron.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col bg-void text-text">
        {children}
      </body>
    </html>
  );
}
