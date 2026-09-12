 
"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type SpiritSelectSceneProps = {
  lineIndex?: number;
};

export function SpiritSelectScene({ lineIndex = 0 }: SpiritSelectSceneProps) {
  const reduced = useReducedMotion();
  const highlight = lineIndex >= 2;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[#07111F]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(85,230,255,0.16),transparent_55%)]" />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center px-6 pb-28 text-center">
        <motion.img
          src="/assets/prologue/spirit/aerin-particles.png"
          alt=""
          className="absolute w-[min(90vw,480px)] opacity-60"
          animate={reduced ? undefined : { rotate: [0, 6, -6, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.img
          src="/assets/prologue/spirit/aerin-idle.png"
          alt="Aerin"
          className="relative w-[min(55vw,260px)] drop-shadow-[0_0_40px_rgba(85,230,255,0.45)]"
          animate={
            reduced
              ? undefined
              : highlight
                ? { y: [0, -14, 0], scale: [1, 1.04, 1] }
                : { y: [0, -10, 0] }
          }
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className={`mt-6 w-full rounded-2xl border p-5 backdrop-blur-xl ${
            highlight
              ? "border-heartlight/50 bg-[#0D1C2D]/85 shadow-[0_0_40px_rgba(85,230,255,0.18)]"
              : "border-white/10 bg-[#0D1C2D]/75"
          }`}
        >
          <p className="font-display text-[10px] tracking-[0.28em] text-heartlight">
            Skyform
          </p>
          <h2 className="mt-2 font-splash text-3xl tracking-[0.18em] text-white">
            AERIN
          </h2>
          <p className="mt-2 text-sm text-muted">
            Spirit of Focus &amp; Navigation
          </p>
          <p className="mt-1 text-xs text-white/40">
            Best for study, coding, learning, ambition
          </p>
        </motion.div>

        <div className="mt-4 grid w-full grid-cols-3 gap-2 opacity-50">
          {["Wildform", "Deepform", "Novaform"].map((name) => (
            <div
              key={name}
              className="rounded-xl border border-white/10 bg-white/5 px-2 py-3"
            >
              <p className="font-display text-[9px] tracking-[0.14em] text-muted uppercase">
                {name}
              </p>
              <p className="mt-1 text-[10px] text-white/30">Coming soon</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
