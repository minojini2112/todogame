import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AwakenForm } from "@/modules/rpg/components/AwakenForm";

export const metadata: Metadata = {
  title: "Bind your signal",
  description: "Sign in to EchoBound. Map your traveler and carry quests across devices.",
};

export default async function AwakenPage() {
  const { userId } = await auth();
  if (userId) {
    redirect("/board");
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-12">
      <AwakenForm />
    </main>
  );
}
