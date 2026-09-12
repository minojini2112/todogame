"use client";

import { AnimatePresence, motion } from "framer-motion";
import { GameButton } from "@/components/ui/GameButton";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type LevelBurstProps = {
  open: boolean;
  level: number;
  onClose: () => void;
};

export function LevelBurst({ open, level, onClose }: LevelBurstProps) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-80 flex items-center justify-center p-4">
          <motion.button
            type="button"
            aria-label="Dismiss level up"
            className="absolute inset-0 bg-[#02080f]/75 backdrop-blur-sm"
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="level-up-title"
            className="relative z-10 w-full max-w-md"
            initial={reduced ? { scale: 1 } : { scale: 0.86, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <GlassPanel glow="gold" className="overflow-hidden p-8 text-center">
              {!reduced
                ? Array.from({ length: 12 }, (_, index) => (
                    <span
                      key={index}
                      aria-hidden
                      className="animate-mote pointer-events-none absolute size-1.5 rounded-full bg-cure"
                      style={{
                        left: `${8 + ((index * 17) % 84)}%`,
                        top: `${12 + ((index * 23) % 70)}%`,
                        animationDelay: `${index * 0.08}s`,
                      }}
                    />
                  ))
                : null}
              <p className="font-display text-[11px] tracking-[0.3em] text-cure uppercase">
                Heartlight surges
              </p>
              <h2 id="level-up-title" className="text-glow-gold mt-3 font-display text-4xl uppercase">
                Level {String(level).padStart(2, "0")}
              </h2>
              <p className="mt-3 text-sm text-muted">
                The city climbs with you. Tomorrow&apos;s quests will ask more — and pay more.
              </p>
              <div className="mt-7">
                <GameButton variant="gold" onClick={onClose}>
                  Claim the height
                </GameButton>
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
