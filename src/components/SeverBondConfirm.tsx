"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

type SeverBondConfirmProps = {
  open: boolean;
  busy?: boolean;
  onStay: () => void;
  onDisconnect: () => void;
  /** City map uses heartlight; board/vault use sanctum gold. */
  tone?: "city" | "sanctum";
};

export function SeverBondConfirm({
  open,
  busy = false,
  onStay,
  onDisconnect,
  tone = "city",
}: SeverBondConfirmProps) {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape" && !busy) onStay();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, busy, onStay]);

  if (!mounted) return null;

  const isSanctum = tone === "sanctum";

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.button
            type="button"
            aria-label="Stay connected"
            className={cn(
              "absolute inset-0 backdrop-blur-sm",
              isSanctum ? "bg-[rgba(6,4,2,0.72)]" : "bg-void/70",
            )}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            disabled={busy}
            onClick={() => {
              if (!busy) onStay();
            }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="sever-bond-title"
            aria-describedby="sever-bond-desc"
            initial={reduced ? false : { opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: 10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className={cn(
              "relative w-full max-w-sm overflow-hidden rounded-[28px] border p-6 shadow-[0_30px_80px_rgba(6,4,2,0.55)]",
              isSanctum
                ? "border-[rgba(232,196,140,0.28)] bg-[linear-gradient(180deg,rgba(36,26,16,0.98),rgba(16,11,8,0.98))]"
                : "border-heartlight/25 bg-void/95 shadow-[0_0_40px_rgba(85,230,255,0.12)]",
            )}
          >
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-x-0 top-0 h-24",
                isSanctum
                  ? "bg-[radial-gradient(ellipse_at_top,rgba(228,180,92,0.2),transparent_70%)]"
                  : "bg-[radial-gradient(ellipse_at_top,rgba(85,230,255,0.18),transparent_70%)]",
              )}
            />

            <p
              className={cn(
                "relative font-display text-[10px] tracking-[0.28em] uppercase",
                isSanctum ? "text-[var(--sanctum-gold)]" : "text-heartlight",
              )}
            >
              Echo Bond
            </p>
            <h2
              id="sever-bond-title"
              className={cn(
                "relative mt-2 font-splash text-2xl",
                isSanctum ? "text-[var(--sanctum-ink)]" : "text-text",
              )}
            >
              Disconnect from Aurelia?
            </h2>
            <p
              id="sever-bond-desc"
              className={cn(
                "relative mt-2 text-sm leading-6",
                isSanctum ? "text-[var(--sanctum-muted)]" : "text-muted",
              )}
            >
              Severing your bond ends this session. Your progress stays — you can return whenever
              you are ready to walk the city again.
            </p>

            <div className="relative mt-6 flex flex-col gap-2.5 sm:flex-row-reverse">
              <button
                type="button"
                disabled={busy}
                onClick={onDisconnect}
                className={cn(
                  "flex-1 rounded-full border px-4 py-2.5 font-display text-[11px] tracking-[0.16em] uppercase transition",
                  busy
                    ? "cursor-wait border-white/10 bg-white/5 text-muted"
                    : isSanctum
                      ? "border-[rgba(240,160,122,0.55)] bg-[rgba(240,160,122,0.14)] text-[#f0a07a] hover:bg-[rgba(240,160,122,0.22)]"
                      : "border-signal/40 bg-signal/15 text-text hover:border-signal/70 hover:bg-signal/25",
                )}
              >
                {busy ? "Severing…" : "Disconnect"}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={onStay}
                className={cn(
                  "flex-1 rounded-full border px-4 py-2.5 font-display text-[11px] tracking-[0.16em] uppercase transition",
                  isSanctum
                    ? "border-white/25 bg-white/5 text-white hover:bg-white/12"
                    : "border-white/20 bg-white/5 text-text hover:bg-white/10",
                )}
              >
                Stay
              </button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
