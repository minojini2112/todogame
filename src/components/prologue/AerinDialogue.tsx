"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type AerinDialogueProps = {
  text: string;
  onNext: () => void;
  nextLabel: string;
  /** Pull the bubble inward (tighter three-column teach layout). */
  compact?: boolean;
};

/** Magical speech bubble — right-center, beside Aerin. */
export function AerinDialogue({
  text,
  onNext,
  nextLabel,
  compact = false,
}: AerinDialogueProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      key={text}
      initial={reduced ? { opacity: 1, x: 0 } : { opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: reduced ? 0.15 : 0.4, ease: "easeOut" }}
      className={
        compact
          ? "pointer-events-none absolute inset-y-0 left-[calc(50%+10.5rem)] z-40 flex items-center pr-3 sm:left-[calc(50%+11.5rem)] sm:pr-4"
          : "pointer-events-none absolute inset-y-0 right-0 z-40 flex items-center px-4 sm:px-6 lg:pr-12"
      }
    >
      <div
        className={
          compact
            ? "pointer-events-auto relative w-[min(42vw,300px)]"
            : "pointer-events-auto relative w-[min(88vw,340px)]"
        }
      >
        {!reduced ? (
          <>
            <span className="pointer-events-none absolute -left-3 top-1/2 size-2 -translate-y-1/2 rounded-full bg-heartlight shadow-[0_0_14px_rgba(85,230,255,1)]" />
            <span className="pointer-events-none absolute -left-8 top-[42%] h-px w-6 bg-gradient-to-r from-transparent to-heartlight/80" />
            <span className="pointer-events-none absolute -right-1 top-4 size-1 rounded-full bg-signal shadow-[0_0_10px_rgba(157,123,255,0.9)]" />
          </>
        ) : null}

        <div className="relative overflow-hidden rounded-2xl border border-heartlight/45 bg-[linear-gradient(160deg,rgba(13,28,45,0.94),rgba(7,17,31,0.9))] px-5 py-4 shadow-[0_0_40px_rgba(85,230,255,0.22),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(85,230,255,0.18),transparent_55%)]" />
          <p className="relative font-display text-[10px] tracking-[0.3em] text-heartlight uppercase">
            Aerin
          </p>
          <p
            className="relative mt-2 font-splash text-base leading-relaxed text-[#F2F8FF] sm:text-lg"
            aria-live="polite"
          >
            {text}
          </p>
          <div className="relative mt-4 flex justify-end">
            <button
              type="button"
              onClick={onNext}
              className="inline-flex items-center justify-center rounded-full border border-heartlight/50 bg-heartlight/10 px-5 py-2.5 font-display text-[11px] font-semibold tracking-[0.2em] text-white uppercase transition hover:bg-heartlight/20 focus-visible:outline-offset-4"
            >
              {nextLabel}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
