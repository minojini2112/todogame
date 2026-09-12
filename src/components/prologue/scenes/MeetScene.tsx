/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function MeetScene() {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.2 : 1 }}
      className="absolute inset-0 overflow-hidden bg-[#050A16]"
    >
      {/* City backdrop */}
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
        className="absolute inset-0 h-full w-full object-cover opacity-90"
      />
      <img
        src="/assets/prologue/city/foreground_buildings.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[#050A16]/35" />

      {/* Aerin + local aura only */}
      <div className="absolute left-1/2 top-[40%] z-10 w-[min(78vw,440px)] -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-heartlight/15 blur-[70px]"
          animate={
            reduced
              ? undefined
              : { opacity: [0.35, 0.7, 0.4], scale: [0.95, 1.08, 1] }
          }
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.img
          src="/assets/prologue/spirit/aerin-particles.png"
          alt=""
          className="pointer-events-none absolute left-1/2 top-1/2 w-[145%] max-w-none -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
          animate={
            reduced
              ? { opacity: 0.85 }
              : { opacity: 0.9, rotate: [0, 6, -4, 0] }
          }
          transition={
            reduced
              ? { duration: 0.2 }
              : { rotate: { duration: 14, repeat: Infinity, ease: "easeInOut" } }
          }
        />

        <motion.img
          src="/assets/prologue/spirit/spirit_flyingfront.png"
          alt="Aerin hovering in front of you"
          className="relative z-10 w-full drop-shadow-[0_0_40px_rgba(85,230,255,0.45)]"
          initial={reduced ? false : { opacity: 0, scale: 0.9, y: 18 }}
          animate={
            reduced
              ? { opacity: 1, scale: 1, y: 0 }
              : { opacity: 1, scale: 1, y: [0, -10, 0] }
          }
          transition={
            reduced
              ? { duration: 0.2 }
              : {
                  opacity: { duration: 0.9 },
                  scale: { duration: 0.9 },
                  y: { duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
                }
          }
        />
      </div>
    </motion.div>
  );
}
