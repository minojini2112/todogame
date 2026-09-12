"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";
import type { PrologueSpeaker } from "@/lib/prologue/script";

type DialogueProps = {
  text: string;
  speaker?: PrologueSpeaker;
  onNext: () => void;
  nextLabel: string;
  /** Centered layout for Aurelia city beats. */
  centered?: boolean;
};

export function Dialogue({
  text,
  speaker,
  onNext,
  nextLabel,
  centered = false,
}: DialogueProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      key={`${speaker ?? "none"}-${text}`}
      initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: centered ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0.15 : 0.45, ease: "easeOut" }}
      className={cn(
        "absolute z-40 p-4 sm:p-6",
        centered
          ? "inset-0 flex items-center justify-center"
          : "inset-x-0 bottom-0",
      )}
    >
      <div
        className={cn(
          "mx-auto flex w-full max-w-3xl gap-4 rounded-2xl border border-white/10 bg-[#07111F]/88 px-5 py-4 shadow-2xl backdrop-blur-xl sm:px-6 sm:py-5",
          centered
            ? "flex-row items-center gap-6 text-left"
            : "flex-col sm:flex-row sm:items-center sm:gap-6",
        )}
      >
        <div className={cn("flex-1", centered ? "text-left" : "text-center sm:text-left")}>
          {speaker ? (
            <p
              className={cn(
                "mb-1 font-display text-[10px] tracking-[0.28em] uppercase",
                speaker === "Aerin" ? "text-heartlight" : "text-muted",
              )}
            >
              {speaker}
            </p>
          ) : null}
          <p
            className="font-splash text-base leading-relaxed text-[#F2F8FF] sm:text-lg"
            aria-live="polite"
          >
            {text}
          </p>
        </div>
        <button
          type="button"
          onClick={onNext}
          className="inline-flex shrink-0 items-center justify-center self-center rounded-full border border-heartlight/40 bg-[#0D1C2D]/95 px-6 py-3 font-display text-xs font-semibold tracking-[0.22em] text-white uppercase shadow-[0_0_25px_rgba(85,230,255,0.15)] transition hover:bg-[#12344A] focus-visible:outline-offset-4"
        >
          {nextLabel}
        </button>
      </div>
    </motion.div>
  );
}
