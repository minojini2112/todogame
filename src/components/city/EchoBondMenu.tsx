"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import { Radio } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

/** Thematic sign-out control — “Echo Bond” seal on the city map. */
export function EchoBondMenu() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [severing, setSevering] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const name =
    user?.firstName ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "EchoBound";
  const initial = name.slice(0, 1).toUpperCase();

  useEffect(() => {
    if (!open) {
      return;
    }

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function severBond() {
    if (severing) {
      return;
    }
    setSevering(true);
    try {
      await signOut({ redirectUrl: "/" });
    } catch {
      setSevering(false);
    }
  }

  return (
    <div ref={rootRef} className="pointer-events-auto absolute bottom-4 left-4 z-40 sm:bottom-5 sm:left-5">
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: reduced ? 0.12 : 0.28, ease: "easeOut" }}
            className="mb-3 w-[min(88vw,260px)] overflow-hidden rounded-2xl border border-heartlight/25 bg-void/85 shadow-[0_0_40px_rgba(85,230,255,0.12)] backdrop-blur-xl"
          >
            <div className="relative px-4 pt-4 pb-3">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(85,230,255,0.16),transparent_55%)]" />
              <p className="relative font-display text-[10px] tracking-[0.28em] text-heartlight uppercase">
                Echo Bond
              </p>
              <p className="relative mt-1.5 font-splash text-lg text-text">{name}</p>
              <p className="relative mt-1 text-xs leading-5 text-muted">
                Your signal is linked to Aurelia. Sever it to leave the city.
              </p>
            </div>

            <div className="border-t border-white/10 px-3 py-3">
              <button
                type="button"
                disabled={severing}
                onClick={() => void severBond()}
                className={cn(
                  "group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full border px-4 py-2.5 font-display text-[11px] tracking-[0.18em] uppercase transition",
                  severing
                    ? "cursor-wait border-white/10 bg-white/5 text-muted"
                    : "border-signal/40 bg-signal/10 text-text hover:border-signal/70 hover:bg-signal/20",
                )}
              >
                {!reduced && !severing ? (
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(157,123,255,0.25),transparent)]"
                    animate={{ x: ["-120%", "120%"] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  />
                ) : null}
                <Radio className="relative h-3.5 w-3.5 text-signal" />
                <span className="relative">
                  {severing ? "Severing…" : "Sever Bond"}
                </span>
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? "Close echo bond menu" : "Open echo bond menu"}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "relative flex items-center gap-2.5 rounded-full border bg-void/75 py-1.5 pr-3.5 pl-1.5 backdrop-blur-xl transition",
          open
            ? "border-heartlight/50 shadow-[0_0_24px_rgba(85,230,255,0.25)]"
            : "border-white/10 hover:border-heartlight/35",
        )}
      >
        <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-heartlight/35 bg-[radial-gradient(circle_at_30%_25%,rgba(85,230,255,0.35),rgba(13,28,45,0.95))] font-display text-sm text-heartlight">
          {!reduced ? (
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full border border-heartlight/40"
              animate={{ opacity: [0.35, 0.9, 0.35], scale: [1, 1.12, 1] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />
          ) : null}
          <span className="relative">{initial}</span>
        </span>
        <span className="text-left">
          <span className="block font-display text-[9px] tracking-[0.22em] text-muted uppercase">
            Bound
          </span>
          <span className="block max-w-[7.5rem] truncate text-xs text-text">{name}</span>
        </span>
      </button>
    </div>
  );
}
