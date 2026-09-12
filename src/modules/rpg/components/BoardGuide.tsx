"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const STORAGE_KEY = "echobound.board-guide.v1";

export type BoardGuideStep = {
  id: string;
  target: string;
  title: string;
  body: string;
};

const STEPS: BoardGuideStep[] = [
  {
    id: "welcome",
    target: "tour-workspace",
    title: "Your quest log",
    body: "This is your quest board. Organize real goals into paths, groups, and quests.",
  },
  {
    id: "lists",
    target: "tour-lists",
    title: "Paths (lists)",
    body: "Switch paths here. Inbox holds quests that don’t belong to a path yet.",
  },
  {
    id: "new-list",
    target: "tour-new-list",
    title: "Create a path",
    body: "Type a name and press Create — like Study, Work, or Health.",
  },
  {
    id: "filter",
    target: "tour-filter",
    title: "Open & Completed",
    body: "Show quests you’re still on, or ones you’ve already finished.",
  },
  {
    id: "groups",
    target: "tour-new-group",
    title: "Create a group",
    body: "Groups are columns inside a path. Open a path first, then add a group here.",
  },
  {
    id: "tasks",
    target: "tour-add-task",
    title: "Add a quest",
    body: "Press + on a group (or Inbox) to add a quest. Finish quests to earn XP.",
  },
  {
    id: "guide",
    target: "tour-guide-btn",
    title: "Need a refresher?",
    body: "Replay this guide anytime with the Guide button up top.",
  },
];

type Rect = { top: number; left: number; width: number; height: number };

function readSeen() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return true;
  }
}

function writeSeen() {
  try {
    window.localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function useBoardGuideAutoStart() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!readSeen()) {
      const timer = window.setTimeout(() => setOpen(true), 600);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const start = useCallback(() => setOpen(true), []);
  const close = useCallback((markSeen = true) => {
    if (markSeen) writeSeen();
    setOpen(false);
  }, []);

  return { open, start, close, setOpen };
}

type BoardGuideProps = {
  open: boolean;
  onClose: (markSeen?: boolean) => void;
};

export function BoardGuide({ open, onClose }: BoardGuideProps) {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const [missing, setMissing] = useState(false);

  const current = STEPS[step];
  const isLast = step >= STEPS.length - 1;

  const measure = useCallback(() => {
    if (!current) return;
    const el = document.querySelector<HTMLElement>(`[data-tour="${current.target}"]`);
    if (!el) {
      setMissing(true);
      setRect(null);
      return;
    }
    setMissing(false);
    const box = el.getBoundingClientRect();
    setRect({
      top: box.top,
      left: box.left,
      width: box.width,
      height: box.height,
    });
    el.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduced ? "auto" : "smooth" });
  }, [current, reduced]);

  useLayoutEffect(() => {
    if (!open) return;
    measure();
  }, [open, step, measure]);

  useEffect(() => {
    if (!open) return;
    function onResize() {
      measure();
    }
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [open, measure]);

  useEffect(() => {
    if (!open) setStep(0);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Enter" || event.repeat) return;
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      event.preventDefault();
      if (step >= STEPS.length - 1) onClose(true);
      else setStep((value) => value + 1);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, step, onClose]);

  if (!open || typeof document === "undefined") return null;

  const pad = 10;
  const tipTop = rect
    ? Math.min(window.innerHeight - 200, Math.max(16, rect.top + rect.height + 14))
    : 80;
  const tipLeft = rect
    ? Math.min(window.innerWidth - 320, Math.max(16, rect.left))
    : 24;

  return createPortal(
    <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-labelledby="board-guide-title">
      {!rect ? <div className="absolute inset-0 bg-[rgba(6,4,2,0.72)]" /> : null}

      {rect ? (
        <motion.div
          className="pointer-events-none absolute rounded-2xl border-2 border-[var(--sanctum-gold)] bg-transparent shadow-[0_0_0_9999px_rgba(6,4,2,0.72),0_0_28px_rgba(228,180,92,0.45)]"
          initial={false}
          animate={{
            top: rect.top - pad,
            left: rect.left - pad,
            width: rect.width + pad * 2,
            height: rect.height + pad * 2,
          }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
        />
      ) : null}

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: -6 }}
          className="absolute z-[91] w-[min(92vw,300px)] rounded-2xl border border-[rgba(232,196,140,0.35)] bg-[linear-gradient(180deg,rgba(36,26,16,0.98),rgba(16,11,8,0.98))] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
          style={{ top: tipTop, left: tipLeft }}
        >
          <p className="font-display text-[10px] tracking-[0.24em] text-[var(--sanctum-gold)] uppercase">
            Guide · {step + 1}/{STEPS.length}
          </p>
          <h2 id="board-guide-title" className="font-splash mt-1 text-xl text-[var(--sanctum-ink)]">
            {current.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--sanctum-muted)]">{current.body}</p>
          {missing ? (
            <p className="mt-2 text-xs text-[#f0a07a]">
              Open a list first if this control isn’t on screen yet — then continue.
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => onClose(true)}
              className="text-xs text-[var(--sanctum-muted)] transition hover:text-[var(--sanctum-ink)]"
            >
              Skip
            </button>
            <div className="flex gap-2">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => setStep((value) => value - 1)}
                  className="rounded-full px-3 py-1.5 text-xs text-[var(--sanctum-muted)] hover:text-[var(--sanctum-ink)]"
                >
                  Back
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  if (isLast) onClose(true);
                  else setStep((value) => value + 1);
                }}
                className="rounded-full border border-white/70 bg-white/10 px-4 py-1.5 font-display text-[10px] tracking-[0.14em] text-white uppercase transition hover:bg-white/20"
              >
                {isLast ? "Got it" : "Next"}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>,
    document.body,
  );
}
