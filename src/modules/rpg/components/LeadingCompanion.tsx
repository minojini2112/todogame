"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { leadingCompanion, SPIRIT_UNLOCK } from "@/modules/rpg/spirits";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { RpgSpiritProgress, RpgSpiritStory } from "@/modules/rpg/types";

const AERIN = {
  name: "Aerin",
  trait: "Guide",
  image: "/assets/prologue/spirit/spirit_flyingfront.png",
  blurb: "Your first companion — walking with you until another spirit takes the lead.",
  lines: [
    "One quest at a time. I’m with you.",
    "The city listens when you move.",
    "Steady path. Clear echo.",
  ],
};

const SPIRIT_LINES: Record<string, string[]> = {
  Aerin: ["One focus. No scatter.", "Hold the still point.", "I’m with you on this path."],
  Lupen: ["Swift and sure. Keep finishing early.", "The hour bends for the ready."],
  Sylva: ["Gentleness is still strength.", "Rest is part of the path."],
  Pyra: ["Rise again. That’s the gift.", "Even late light still counts."],
};

type LeadingCompanionProps = {
  spirits: RpgSpiritProgress[];
  stories?: RpgSpiritStory[];
};

export function LeadingCompanion({ spirits, stories = [] }: LeadingCompanionProps) {
  const reduced = useReducedMotion();
  const scored = leadingCompanion(spirits, stories);
  const hasLead = scored.points > 0;
  const display = hasLead
    ? {
        name: scored.name,
        trait: scored.trait,
        image: scored.image,
        points: scored.points,
        blurb: `${scored.trait} · ${scored.points} spirit points`,
      }
    : {
        name: AERIN.name,
        trait: AERIN.trait,
        image: AERIN.image,
        points: 0,
        blurb: AERIN.blurb,
      };

  const [whisper, setWhisper] = useState<string | null>(null);
  const [nudge, setNudge] = useState(0);

  function speak() {
    const pool =
      display.name === "Aerin"
        ? AERIN.lines
        : (SPIRIT_LINES[display.name] ?? ["The path answers those who walk it."]);
    const line = pool[Math.floor(Math.random() * pool.length)] ?? pool[0];
    setWhisper(line);
    setNudge((value) => value + 1);
    window.setTimeout(() => setWhisper(null), 2800);
  }

  return (
    <aside
      data-tour="tour-companion"
      className="sanctum-panel sanctum-panel-glow relative flex w-full shrink-0 flex-col overflow-hidden rounded-[28px] border border-[rgba(232,196,140,0.28)] p-4 sm:max-w-[280px] lg:w-[280px]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(228,180,92,0.16),transparent_55%)]" />
      {!reduced ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 sanctum-motes opacity-50" />
      ) : null}

      <p className="relative font-display text-[10px] tracking-[0.28em] text-[var(--sanctum-gold)] uppercase">
        Leading companion
      </p>
      <h2 className="relative mt-1 font-splash text-2xl text-[var(--sanctum-ink)]">{display.name}</h2>
      <p className="relative mt-1 text-xs leading-5 text-[var(--sanctum-muted)]">{display.blurb}</p>

      <button
        type="button"
        onClick={speak}
        className="relative mt-4 flex flex-1 flex-col items-center justify-center py-2 text-left"
        aria-label={`Hear from ${display.name}`}
        title="Tap companion"
      >
        <motion.div
          key={nudge}
          className="relative h-[240px] w-full sm:h-[280px]"
          animate={
            reduced
              ? undefined
              : {
                  y: [0, -10, 0],
                  scale: nudge > 0 ? [1, 1.04, 1] : 1,
                }
          }
          transition={{
            y: { duration: 4.2, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 0.45 },
          }}
        >
          {!reduced ? (
            <motion.div
              aria-hidden
              className="absolute top-1/2 left-1/2 size-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(85,230,255,0.22),transparent_68%)] blur-2xl"
              animate={{ opacity: [0.45, 0.85, 0.45], scale: [0.92, 1.06, 0.92] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
            />
          ) : null}
          <Image
            src={display.image}
            alt={display.name}
            fill
            sizes="280px"
            className="object-contain drop-shadow-[0_0_28px_rgba(85,230,255,0.35)] transition hover:drop-shadow-[0_0_36px_rgba(85,230,255,0.55)]"
            priority
          />
        </motion.div>
      </button>

      <div className="relative mt-2 min-h-[3rem]">
        <AnimatePresence mode="wait">
          {whisper ? (
            <motion.p
              key={whisper}
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="rounded-xl border border-heartlight/25 bg-black/30 px-3 py-2 text-center text-xs leading-5 text-[var(--sanctum-ink)]"
            >
              “{whisper}”
            </motion.p>
          ) : hasLead ? (
            <>
              <div className="h-1.5 overflow-hidden rounded-full bg-black/40">
                <motion.div
                  className="h-full rounded-full bg-[linear-gradient(90deg,var(--sanctum-ember),var(--sanctum-gold))]"
                  initial={reduced ? false : { width: 0 }}
                  animate={{
                    width: `${Math.min(100, Math.round((display.points / SPIRIT_UNLOCK) * 100))}%`,
                  }}
                  transition={{ duration: reduced ? 0 : 0.8, ease: "easeOut" }}
                />
              </div>
              <p className="mt-2 text-center font-display text-[10px] tracking-[0.18em] text-[var(--sanctum-muted)] uppercase">
                {display.points} / {SPIRIT_UNLOCK} to awaken
              </p>
            </>
          ) : (
            <p className="text-center font-display text-[10px] tracking-[0.18em] text-[var(--sanctum-muted)] uppercase">
              Tap Aerin to hear a word · Bound from the start
            </p>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}
