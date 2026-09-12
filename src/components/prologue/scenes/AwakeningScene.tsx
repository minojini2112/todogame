 
"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function AwakeningScene() {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.2 : 1 }}
      className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[#050A16]"
    >
      <motion.div
        className="absolute h-[500px] w-[500px] rounded-full bg-heartlight/10 blur-[100px]"
        animate={
          reduced
            ? undefined
            : { scale: [0.6, 1.25, 1], opacity: [0, 1, 0.55] }
        }
        transition={{ duration: 4, ease: "easeOut" }}
      />

      <motion.img
        src="/assets/prologue/spirit/aerin-silhouette.png"
        alt=""
        className="absolute w-[min(60vw,320px)]"
        initial={reduced ? false : { opacity: 0, scale: 0.6 }}
        animate={
          reduced
            ? { opacity: 0.4, scale: 1 }
            : { opacity: [0, 1, 0], scale: [0.6, 1, 1.2] }
        }
        transition={{ duration: reduced ? 0.2 : 4, ease: "easeInOut" }}
      />

      <motion.img
        src="/assets/prologue/spirit/aerin-glow.png"
        alt=""
        className="absolute w-[min(70vw,380px)]"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduced ? 0.2 : 2, delay: reduced ? 0 : 2 }}
      />

      <motion.img
        src="/assets/prologue/spirit/aerin-particles.png"
        alt=""
        className="absolute w-[min(90vw,520px)]"
        animate={
          reduced
            ? undefined
            : { rotate: [0, 10, -10, 0], scale: [0.9, 1.1, 1] }
        }
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.img
        src="/assets/prologue/spirit/aerin-idle.png"
        alt="Aerin appearing in light"
        className="relative z-10 w-[min(55vw,280px)] drop-shadow-[0_0_40px_rgba(85,230,255,0.45)]"
        initial={reduced ? false : { opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduced ? 0.2 : 1.4, delay: reduced ? 0 : 2.8 }}
      />
    </motion.div>
  );
}
