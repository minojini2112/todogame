/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type HopeSceneProps = {
  lineIndex?: number;
};

export function HopeScene({ lineIndex = 0 }: HopeSceneProps) {
  const reduced = useReducedMotion();
  const glow = 0.35 + lineIndex * 0.2;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.2 : 1 }}
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
        src="/assets/prologue/city/smoke.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-70"
        animate={reduced ? undefined : { x: [-8, 8, -8] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.img
        src="/assets/prologue/city/particles.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover mix-blend-screen"
        animate={reduced ? undefined : { opacity: [0.3, 0.7, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Distant surviving light */}
      <motion.div
        className="absolute right-[28%] top-[42%] h-3 w-3 rounded-full bg-cure"
        style={{ boxShadow: `0 0 ${24 + lineIndex * 18}px rgba(255,200,87,0.9)` }}
        animate={
          reduced
            ? { opacity: glow }
            : { opacity: [glow * 0.6, glow, glow * 0.7], scale: [1, 1.35, 1] }
        }
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute right-[18%] top-[30%] h-40 w-40 -translate-y-1/2 rounded-full bg-heartlight/20 blur-3xl"
        animate={{ opacity: glow }}
      />
    </motion.div>
  );
}
