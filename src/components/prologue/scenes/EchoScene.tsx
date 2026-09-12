/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function EchoScene() {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.2 : 1.2 }}
      className="absolute inset-0 overflow-hidden bg-[#050A16]"
    >
      <img
        src="/assets/prologue/city/sky.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <img
        src="/assets/prologue/city/distant_city.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-[#050A16]/70" />

      <motion.div
        className="absolute left-1/2 top-[42%] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-heartlight/10 blur-[100px]"
        animate={
          reduced
            ? undefined
            : { scale: [0.8, 1.15, 0.9], opacity: [0.3, 0.7, 0.4] }
        }
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.img
        src="/assets/prologue/spirit/aerin-particles.png"
        alt=""
        className="absolute left-1/2 top-[42%] w-[min(80vw,520px)] -translate-x-1/2 -translate-y-1/2"
        animate={
          reduced
            ? undefined
            : { rotate: [0, 8, -8, 0], scale: [0.95, 1.05, 0.95] }
        }
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.img
        src="/assets/prologue/spirit/aerin-silhouette.png"
        alt=""
        className="absolute left-1/2 top-[42%] w-[min(55vw,300px)] -translate-x-1/2 -translate-y-1/2"
        initial={reduced ? false : { opacity: 0, scale: 0.7 }}
        animate={{ opacity: 0.9, scale: 1 }}
        transition={{ duration: reduced ? 0.2 : 2.2, ease: "easeOut" }}
      />
    </motion.div>
  );
}
