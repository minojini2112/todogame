/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import { usePhoneLayout } from "@/hooks/usePhoneLayout";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Aerin + sunrise for the emotional purpose beat. */
export function PurposeScene() {
  const reduced = useReducedMotion();
  const phone = usePhoneLayout();

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
      <motion.img
        src="/assets/prologue/city/light_rays.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover mix-blend-screen opacity-70"
        animate={reduced ? undefined : { opacity: [0.4, 0.75, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#030811]/80 via-transparent to-[#030811]/30" />

      {/* Left — Aerin */}
      <div className={`absolute left-0 top-[48%] z-10 -translate-y-1/2 ${phone ? "w-[min(28vw,160px)]" : "w-[min(58vw,460px)] sm:left-2 sm:w-[min(48vw,520px)] lg:left-4"}`}>
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
          className="relative z-10 w-full drop-shadow-[0_0_40px_rgba(85,230,255,0.45)]"
          animate={reduced ? undefined : { y: [0, -12, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Middle — path explanation */}
      <div className={`absolute top-[48%] left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 ${phone ? "w-[min(24vw,170px)]" : "w-[min(72vw,280px)] sm:w-[min(28vw,300px)]"}`}>
        <div className="rounded-2xl border border-heartlight/30 bg-[#0D1C2D]/90 p-4 shadow-[0_0_40px_rgba(85,230,255,0.12)] backdrop-blur-xl">
          <p className="font-display text-[10px] tracking-[0.28em] text-heartlight">
            Your Path
          </p>
          <p className="mt-2 font-splash text-lg text-white">
            One Quest. One day.
          </p>
          <p className="mt-2 text-sm text-muted">One Echo at a time.</p>
        </div>
      </div>
    </motion.div>
  );
}
