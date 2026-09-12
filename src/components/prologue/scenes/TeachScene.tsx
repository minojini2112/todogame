/* eslint-disable @next/next/no-img-element */
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type TeachSceneProps = {
  lineIndex?: number;
};

export function TeachScene({ lineIndex = 0 }: TeachSceneProps) {
  const reduced = useReducedMotion();
  const showQuest = lineIndex >= 0;
  const showComplete = lineIndex >= 3;
  const showLevel = lineIndex >= 4;
  const showAttrs = lineIndex >= 5;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 overflow-hidden bg-[#050A16]"
    >
      <img
        src="/assets/prologue/city/sky.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <img
        src="/assets/prologue/city/distant_city.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <img
        src="/assets/prologue/city/destroyed_buildings.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-[#050A16]/45" />

      {/* Left — Aerin */}
      <div className="absolute left-0 top-[48%] z-10 w-[min(58vw,460px)] -translate-y-1/2 sm:left-2 sm:w-[min(48vw,520px)] lg:left-4">
        <motion.img
          src="/assets/prologue/spirit/aerin-particles.png"
          alt=""
          className="pointer-events-none absolute left-1/2 top-1/2 w-[145%] max-w-none -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
          animate={reduced ? undefined : { rotate: [0, 5, -4, 0], opacity: [0.7, 0.95, 0.75] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.img
          src="/assets/prologue/spirit/spirit_flyingfront.png"
          alt="Aerin"
          className="relative z-10 w-full drop-shadow-[0_0_40px_rgba(85,230,255,0.45)]"
          animate={reduced ? undefined : { y: [0, -12, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Middle — working explanation cards (true screen center) */}
      <div className="absolute top-[48%] left-1/2 z-20 w-[min(72vw,280px)] -translate-x-1/2 -translate-y-1/2 sm:w-[min(28vw,300px)]">
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="wait">
            {showQuest && !showComplete ? (
              <motion.div
                key="quest"
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-2xl border border-heartlight/30 bg-[#0D1C2D]/90 p-4 shadow-[0_0_40px_rgba(85,230,255,0.12)] backdrop-blur-xl"
              >
                <p className="font-display text-[10px] tracking-[0.28em] text-heartlight">
                  QUEST
                </p>
                <p className="mt-2 font-splash text-lg text-white">
                  Meditate
                </p>
                <p className="mt-3 font-display text-sm text-cure">+100 XP</p>
              </motion.div>
            ) : null}

            {showComplete ? (
              <motion.div
                key="complete"
                initial={reduced ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-cure/40 bg-[#0D1C2D]/90 p-4 shadow-[0_0_40px_rgba(255,200,87,0.15)] backdrop-blur-xl"
              >
                <p className="font-display text-[10px] tracking-[0.28em] text-cure">
                  Quest Complete
                </p>
                <p className="mt-2 font-splash text-xl text-white">+100 XP</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-heartlight"
                    initial={{ width: "12%" }}
                    animate={{ width: showLevel ? "68%" : "42%" }}
                    transition={{ duration: reduced ? 0.2 : 1.1 }}
                  />
                </div>
                {showLevel ? (
                  <p className="mt-2 font-display text-xs tracking-[0.2em] text-heartlight">
                    Level 1 → Level 2
                  </p>
                ) : null}
              </motion.div>
            ) : null}
          </AnimatePresence>

          {showAttrs ? (
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 gap-2"
            >
              {["Focus", "Intelligence", "Strength", "Resilience", "Creativity"].map(
                (attr, i) => (
                  <motion.div
                    key={attr}
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reduced ? 0 : i * 0.08 }}
                    className="rounded-xl border border-white/10 bg-[#0D1C2D]/85 px-3 py-2.5 text-center backdrop-blur-md"
                  >
                    <p className="font-display text-[9px] tracking-[0.16em] text-muted uppercase">
                      {attr}
                    </p>
                    <p className="mt-1 text-sm text-healing">+1</p>
                  </motion.div>
                ),
              )}
            </motion.div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
