"use client";

import { motion } from "framer-motion";
import { CompassMark } from "@/components/intro/CompassMark";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function EndingScene() {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.2 : 1 }}
      className="absolute inset-0 flex items-center justify-center bg-[#030811]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(85,230,255,0.12),transparent_50%)]" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <CompassMark className="size-16" />
        <p className="mt-6 font-splash text-3xl tracking-[0.3em] text-white sm:text-4xl">
          ECHOBOUND
        </p>
        <p className="mt-3 font-display text-xs tracking-[0.28em] text-heartlight">
          Welcome, EchoBound
        </p>
        <p className="mt-4 max-w-sm text-sm leading-6 text-muted">
          Your tasks. Your journey. A brighter tomorrow.
        </p>
      </div>
    </motion.div>
  );
}
