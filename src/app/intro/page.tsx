import type { Metadata } from "next";
import Prologue from "@/components/prologue/Prologue";

export const metadata: Metadata = {
  title: "Prologue",
};

export default function IntroPage() {
  return <Prologue />;
}
