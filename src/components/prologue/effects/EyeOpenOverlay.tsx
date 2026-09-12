"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type EyeOpenOverlayProps = {
  /** When true, lids stay open (already awake). */
  forceOpen?: boolean;
};

/**
 * First-person eyelid wipe: blink peek → close → slow open.
 */
export function EyeOpenOverlay({ forceOpen = false }: EyeOpenOverlayProps) {
  const reduced = useReducedMotion();

  if (reduced || forceOpen) {
    return null;
  }

  const lidTransition = {
    duration: 3.6,
    times: [0, 0.18, 0.32, 0.42, 1],
    ease: "easeInOut" as const,
  };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-40 overflow-hidden"
    >
      {/* Soft focus haze while waking */}
      <motion.div
        className="absolute inset-0 bg-black"
        initial={{ opacity: 0.55 }}
        animate={{ opacity: [0.55, 0.35, 0.6, 0.45, 0] }}
        transition={lidTransition}
      />

      {/* Upper eyelid */}
      <motion.div
        className="absolute inset-x-0 top-0 h-[52%] origin-top bg-[#02060d]"
        style={{
          borderBottomLeftRadius: "50% 18%",
          borderBottomRightRadius: "50% 18%",
          boxShadow: "inset 0 -24px 40px rgba(0,0,0,0.85)",
        }}
        initial={{ scaleY: 1 }}
        animate={{ scaleY: [1, 0.72, 1, 0.88, 0] }}
        transition={lidTransition}
      />

      {/* Lower eyelid */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-[52%] origin-bottom bg-[#02060d]"
        style={{
          borderTopLeftRadius: "50% 18%",
          borderTopRightRadius: "50% 18%",
          boxShadow: "inset 0 24px 40px rgba(0,0,0,0.85)",
        }}
        initial={{ scaleY: 1 }}
        animate={{ scaleY: [1, 0.72, 1, 0.88, 0] }}
        transition={lidTransition}
      />

      {/* Tear-line / lashes edge */}
      <motion.div
        className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-black/80"
        initial={{ opacity: 1, scaleX: 1 }}
        animate={{ opacity: [1, 0.6, 1, 0.4, 0], scaleX: [1, 0.95, 1, 0.9, 0.2] }}
        transition={lidTransition}
      />
    </div>
  );
}
