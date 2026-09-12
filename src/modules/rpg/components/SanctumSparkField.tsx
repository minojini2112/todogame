"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";

type Spark = {
  id: number;
  x: number;
  y: number;
};

const ORBITS = [
  { top: "18%", left: "8%", delay: 0, size: 6 },
  { top: "32%", left: "88%", delay: 0.8, size: 5 },
  { top: "72%", left: "12%", delay: 1.4, size: 4 },
  { top: "64%", left: "78%", delay: 2.1, size: 5 },
  { top: "48%", left: "52%", delay: 0.4, size: 3 },
];

/** Ambient gold sparks — click to send a mote burst. */
export function SanctumSparkField() {
  const reduced = useReducedMotion();
  const [bursts, setBursts] = useState<Spark[]>([]);

  const spawn = useCallback(
    (x: number, y: number) => {
      if (reduced) return;
      const id = Date.now() + Math.random();
      setBursts((current) => [...current, { id, x, y }]);
      window.setTimeout(() => {
        setBursts((current) => current.filter((spark) => spark.id !== id));
      }, 900);
    },
    [reduced],
  );

  if (reduced) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[5] overflow-hidden"
    >
      {ORBITS.map((orbit) => (
        <button
          key={orbit.delay}
          type="button"
          tabIndex={-1}
          aria-hidden
          className="pointer-events-auto absolute rounded-full bg-[var(--sanctum-gold)] shadow-[0_0_12px_rgba(228,180,92,0.8)] transition hover:scale-150 hover:shadow-[0_0_18px_rgba(228,180,92,1)] focus-visible:outline-none"
          style={{
            top: orbit.top,
            left: orbit.left,
            width: orbit.size,
            height: orbit.size,
            animation: `sanctum-spark-float ${5 + orbit.delay}s ease-in-out ${orbit.delay}s infinite`,
          }}
          onClick={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            spawn(rect.left + rect.width / 2, rect.top + rect.height / 2);
          }}
        />
      ))}

      <AnimatePresence>
        {bursts.map((burst) => (
          <motion.span
            key={burst.id}
            className="pointer-events-none fixed size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--sanctum-gold)]"
            style={{ left: burst.x, top: burst.y }}
            initial={{ opacity: 0.9, scale: 0.3 }}
            animate={{ opacity: 0, scale: 4.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
