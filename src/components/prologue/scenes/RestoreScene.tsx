/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type RestoreSceneProps = {
  lineIndex?: number;
};

export function RestoreScene({ lineIndex = 0 }: RestoreSceneProps) {
  const reduced = useReducedMotion();
  const restoration = Math.min(100, 12 + lineIndex * 22);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 overflow-hidden"
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
        className="absolute inset-0 h-full w-full object-cover"
      />
      <img
        src="/assets/prologue/city/foreground_buildings.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <motion.img
        src="/assets/prologue/city/light_rays.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover mix-blend-screen"
        animate={{ opacity: 0.35 + lineIndex * 0.12 }}
      />
      <div className="absolute inset-0 bg-[#050A16]/25" />

      {/* Left — Aerin */}
      <div className="absolute left-0 top-[48%] z-10 w-[min(58vw,460px)] -translate-y-1/2 sm:left-2 sm:w-[min(48vw,520px)] lg:left-4">
        <motion.img
          src="/assets/prologue/spirit/aerin-particles.png"
          alt=""
          className="pointer-events-none absolute left-1/2 top-1/2 w-[145%] max-w-none -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
          animate={reduced ? undefined : { rotate: [0, 5, -4, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.img
          src="/assets/prologue/spirit/spirit_flyingfront.png"
          alt="Aerin"
          className="relative z-10 w-full drop-shadow-[0_0_36px_rgba(85,230,255,0.4)]"
          animate={reduced ? undefined : { y: [0, -12, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Middle — restoration explanation */}
      <div className="absolute top-[48%] left-1/2 z-20 w-[min(72vw,280px)] -translate-x-1/2 -translate-y-1/2 sm:w-[min(28vw,300px)]">
        <div className="rounded-2xl border border-white/10 bg-[#07111F]/80 p-4 backdrop-blur-xl">
          <p className="font-display text-[10px] tracking-[0.28em] text-heartlight">
            Academy District
          </p>
          <p className="mt-2 font-splash text-lg text-white">
            Restoration: {restoration}%
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-healing"
              animate={{ width: `${restoration}%` }}
              transition={{ duration: reduced ? 0.2 : 0.8 }}
            />
          </div>
          {lineIndex >= 3 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-cure/40 bg-cure/10 px-3 py-1 text-xs text-cure">
                ✦ Cure Key
              </span>
              <span className="rounded-full border border-heartlight/30 bg-heartlight/10 px-3 py-1 text-xs text-heartlight">
                + XP
              </span>
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white">
                + Gold
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
