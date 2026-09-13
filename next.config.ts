import type { NextConfig } from "next";

const clerkPk = (
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  process.env.CLERK_PUBLISHABLE_KEY ||
  ""
).trim();

// Visible in Vercel build logs — proves whether the key reached the build.
console.info(
  `[echobound] NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY at build: ${
    clerkPk ? `present (${clerkPk.slice(0, 7)}…, ${clerkPk.length} chars)` : "MISSING"
  }`,
);

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
  },
};

export default nextConfig;
