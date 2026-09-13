import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AwakenForm } from "@/modules/rpg/components/AwakenForm";
import { getOptionalUserId } from "@/lib/clerk-auth";
import { isClerkConfigured } from "@/lib/clerk";

export const metadata: Metadata = {
  title: "Bind your signal",
  description: "Sign in to EchoBound. Map your traveler and carry quests across devices.",
};

export const dynamic = "force-dynamic";

export default async function AwakenPage() {
  if (!isClerkConfigured) {
    redirect("/");
  }

  const userId = await getOptionalUserId();
  if (userId) {
    redirect("/board");
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-12">
      <AwakenForm />
    </main>
  );
}
