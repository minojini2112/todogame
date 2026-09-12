/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function CityRevealScene() {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.2 : 1.5 }}
      className="absolute inset-0 overflow-hidden"
    >
      <motion.img
        src="/assets/prologue/city/sky.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        initial={reduced ? false : { scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: "easeOut" }}
      />
      <motion.img
        src="/assets/prologue/city/distant_city.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        initial={reduced ? false : { scale: 1.08 }}
        animate={{ scale: 1.02 }}
        transition={{ duration: 8, ease: "easeOut" }}
      />
      <motion.img
        src="/assets/prologue/city/destroyed_buildings.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        initial={reduced ? false : { x: -20 }}
        animate={{ x: 0 }}
        transition={{ duration: 6, ease: "easeOut" }}
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
        animate={reduced ? undefined : { x: [-10, 10, -10] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.img
        src="/assets/prologue/city/light_rays.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        animate={reduced ? undefined : { opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.img
        src="/assets/prologue/city/particles.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        animate={reduced ? undefined : { y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
