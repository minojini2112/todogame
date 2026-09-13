import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Prologue from "@/components/prologue/Prologue";
import { getOptionalUserId } from "@/lib/clerk-auth";

export const metadata: Metadata = {
  title: "Prologue",
  description:
    "Begin the EchoBound todo game. Open your eyes in ruined Aurelia and start the Eco Bound journey.",
  alternates: { canonical: "/intro" },
};

export default async function IntroPage() {
  const userId = await getOptionalUserId();
  if (userId) {
    redirect("/city");
  }

  return <Prologue />;
}
