"use client";

import { motion, useReducedMotion } from "motion/react";
import { TOWER_MAP, type TowerId } from "@/lib/city/towers";

type Props = {
  towerId: TowerId;
  isTraveling: boolean;
};

export default function PlayerMarker({ towerId, isTraveling }: Props) {
  const reduceMotion = useReducedMotion();
  const tower = TOWER_MAP[towerId];

  return (
    <motion.div
      className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${tower.x}%`, top: `${tower.y}%` }}
      animate={{ left: `${tower.x}%`, top: `${tower.y}%` }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 70, damping: 18, mass: 0.7 }
      }
      aria-hidden
    >
      <div className="relative flex h-5 w-5 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-cyan/30 blur-md" />
        <span
          className={`relative h-3.5 w-3.5 rounded-full bg-gradient-to-br from-cyan to-heal shadow-[0_0_16px_rgba(85,230,255,0.9)] ${
            isTraveling ? "scale-110" : ""
          }`}
        />
        {!reduceMotion && (
          <span className="absolute inset-[-8px] rounded-full border border-cyan/50 animate-ping" />
        )}
      </div>
    </motion.div>
  );
}
