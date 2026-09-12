import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Prologue from "@/components/prologue/Prologue";

export const metadata: Metadata = {
  title: "Prologue",
};

export default async function IntroPage() {
  const { userId } = await auth();
  if (userId) {
    redirect("/city");
  }

  return <Prologue />;
}
