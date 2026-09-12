"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function BlackoutScene() {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.2 : 1 }}
      className="absolute inset-0 flex items-center justify-center bg-[#030811]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(85,230,255,0.08),transparent_45%)]" />
      {!reduced
        ? Array.from({ length: 18 }).map((_, i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              className="absolute size-1 rounded-full bg-heartlight/50"
              style={{
                left: `${8 + ((i * 37) % 84)}%`,
                top: `${12 + ((i * 53) % 76)}%`,
              }}
              animate={{ opacity: [0.1, 0.7, 0.1], scale: [0.6, 1.2, 0.6] }}
              transition={{
                duration: 3 + (i % 4),
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))
        : null}
    </motion.div>
  );
}
