 
"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function AerinScene() {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.2 : 1 }}
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-[#07111F]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(85,230,255,0.16),transparent_55%)]" />

      <motion.img
        src="/assets/prologue/spirit/aerin-particles.png"
        alt=""
        className="absolute w-[min(90vw,560px)] opacity-70"
        animate={reduced ? undefined : { rotate: [0, 6, -6, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.img
        src="/assets/prologue/spirit/aerin-glow.png"
        alt=""
        className="absolute w-[min(70vw,360px)]"
        animate={reduced ? undefined : { opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.img
        src="/assets/prologue/spirit/aerin-idle.png"
        alt="Aerin, spirit of focus and navigation"
        className="relative z-10 w-[min(58vw,300px)] drop-shadow-[0_0_36px_rgba(85,230,255,0.4)]"
        animate={
          reduced
            ? undefined
            : { y: [0, -10, 0] }
        }
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 mt-8 text-center">
        <p className="font-display text-xs tracking-[0.35em] text-heartlight">
          SKYFORM
        </p>
        <h2 className="mt-2 font-splash text-3xl tracking-[0.2em] text-white sm:text-4xl">
          AERIN
        </h2>
        <p className="mt-3 text-sm tracking-[0.12em] text-muted">
          Gift: Focus &amp; Navigation
        </p>
      </div>
    </motion.div>
  );
}
