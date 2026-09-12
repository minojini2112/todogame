"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useRef } from "react";
import { GameButton } from "@/components/ui/GameButton";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type RewardItem = {
  label: string;
  value: string;
};

type RewardPopupProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  xp: number;
  shards: number;
  items?: RewardItem[];
};

export function RewardPopup({
  open,
  onClose,
  title = "Quest Complete",
  subtitle = "Signal returned to Aurelia.",
  xp,
  shards,
  items = [],
}: RewardPopupProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!open) {
      return;
    }

    previousFocus.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previousFocus.current?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-80 flex items-center justify-center p-4">
          <motion.button
            type="button"
            aria-label="Dismiss reward"
            className="absolute inset-0 bg-[#02080f]/70 backdrop-blur-sm"
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? { opacity: 1 } : { opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
            transition={{ duration: reduced ? 0 : 0.45, ease: "easeOut" }}
            className="relative z-10 w-full max-w-md"
          >
            <GlassPanel glow="gold" className="p-8 text-center">
              <p className="font-display text-[11px] tracking-[0.28em] text-cure">
                SIGNAL ACQUIRED
              </p>
              <h2 id={titleId} className="mt-3 font-display text-2xl uppercase tracking-[0.12em]">
                {title}
              </h2>
              <p className="mt-2 text-sm text-muted">{subtitle}</p>

              <div
                className="mt-6 grid grid-cols-2 gap-3"
                aria-live="polite"
              >
                <div className="rounded-xl border border-heartlight/20 bg-heartlight/10 px-3 py-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted">XP</p>
                  <p className="mt-1 font-display text-2xl text-heartlight">+{xp}</p>
                </div>
                <div className="rounded-xl border border-signal/20 bg-signal/10 px-3 py-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted">Shards</p>
                  <p className="mt-1 font-display text-2xl text-signal">+{shards}</p>
                </div>
              </div>

              {items.length > 0 ? (
                <ul className="mt-5 space-y-2 text-left">
                  {items.map((item) => (
                    <li
                      key={item.label}
                      className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
                    >
                      <span className="text-muted">{item.label}</span>
                      <span className="text-cure">{item.value}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="mt-7">
                <GameButton ref={closeRef} variant="gold" onClick={onClose}>
                  Continue
                </GameButton>
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
