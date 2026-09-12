/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function FlightScene() {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.2 : 1.2 }}
      className="absolute inset-0 overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        animate={
          reduced
            ? undefined
            : { scale: [1, 1.08, 1.14], y: [0, -16, -32] }
        }
        transition={{ duration: 10, ease: "easeInOut" }}
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
          className="absolute inset-0 h-full w-full object-cover"
          animate={reduced ? undefined : { x: [-12, 12, -12] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.img
          src="/assets/prologue/city/particles.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          animate={reduced ? undefined : { y: [0, 30, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <motion.img
        src="/assets/prologue/spirit/aerin-flying.png"
        alt="Aerin flying over Aurelia"
        className="absolute left-1/2 top-[38%] w-[min(70vw,360px)] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_30px_rgba(85,230,255,0.35)]"
        animate={
          reduced
            ? undefined
            : { y: [0, -16, 0], x: [-8, 10, -8] }
        }
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
