import type { Metadata } from "next";
import { SplashScreen } from "@/components/intro/SplashScreen";
import { HomeSeo } from "@/components/seo/HomeSeo";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: SITE_TITLE,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <>
      <SplashScreen />
      <HomeSeo />
    </>
  );
}
