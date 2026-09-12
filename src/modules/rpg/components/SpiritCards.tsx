"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { mergeSpiritRows, spiritFill, SPIRIT_UNLOCK } from "@/modules/rpg/spirits";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { RpgSpiritProgress, RpgSpiritStory } from "@/modules/rpg/types";

export function SpiritCards({
  spirits,
  stories,
}: {
  spirits: RpgSpiritProgress[];
  stories: RpgSpiritStory[];
}) {
  const reduced = useReducedMotion();
  const rows = mergeSpiritRows(spirits, stories);
  const [openId, setOpenId] = useState<(typeof rows)[number]["id"] | null>(null);
  const open = rows.find((spirit) => spirit.id === openId) ?? null;

  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2">
        {rows.map((spirit, index) => {
          const fill = spiritFill(spirit.points);
          const awake = spirit.points >= SPIRIT_UNLOCK;
          return (
            <motion.button
              key={spirit.id}
              type="button"
              onClick={() => setOpenId(spirit.id)}
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduced ? 0 : index * 0.07, duration: 0.4 }}
              whileHover={
                reduced
                  ? undefined
                  : { y: -6, boxShadow: "0 16px 40px rgba(6,4,2,0.45), 0 0 24px rgba(228,180,92,0.18)" }
              }
              whileTap={reduced ? undefined : { scale: 0.98 }}
              className="group relative overflow-hidden rounded-[24px] border border-[rgba(232,196,140,0.22)] bg-[rgba(12,9,7,0.55)] text-left transition"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(228,180,92,0.18),transparent_55%)]" />
                {!reduced ? (
                  <div className="absolute inset-0 sanctum-motes opacity-40" />
                ) : null}
              </div>

              <div className="relative h-56 w-full overflow-hidden bg-black sm:h-64">
                <motion.div
                  className="absolute inset-0"
                  animate={reduced ? undefined : { y: [0, -6, 0] }}
                  transition={{ duration: 4 + index * 0.3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Image
                    src={spirit.image}
                    alt={spirit.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 40vw"
                    className="object-contain p-3 drop-shadow-[0_0_24px_rgba(228,180,92,0.25)] transition duration-500 group-hover:drop-shadow-[0_0_32px_rgba(85,230,255,0.35)]"
                  />
                </motion.div>
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[rgba(12,9,7,0.98)] to-transparent"
                />
                {awake ? (
                  <span className="absolute top-3 right-3 rounded-full border border-[var(--sanctum-gold)]/50 bg-[rgba(228,180,92,0.18)] px-2.5 py-1 font-display text-[9px] tracking-[0.18em] text-[var(--sanctum-gold)] uppercase">
                    Awake
                  </span>
                ) : null}
              </div>

              <div className="relative p-4">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 bg-[rgba(228,180,92,0.14)] transition-[height] duration-500"
                  style={{ height: `${Math.round(fill * 100)}%` }}
                />
                <div className="relative">
                  <p className="font-display text-[10px] tracking-[0.22em] text-[var(--sanctum-gold)] uppercase">
                    {spirit.trait}
                  </p>
                  <h3 className="font-splash mt-1 text-2xl text-[var(--sanctum-ink)]">{spirit.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--sanctum-muted)]">
                    {spirit.watches}
                  </p>
                  <div className="mt-3 h-1 overflow-hidden rounded-full bg-black/35">
                    <motion.div
                      className="h-full rounded-full bg-[linear-gradient(90deg,var(--sanctum-ember),var(--sanctum-gold))]"
                      initial={reduced ? false : { width: 0 }}
                      animate={{ width: `${Math.round(fill * 100)}%` }}
                      transition={{ duration: reduced ? 0 : 0.8, delay: reduced ? 0 : 0.15 + index * 0.05 }}
                    />
                  </div>
                  <p className="mt-2 flex items-center justify-between text-xs text-[var(--sanctum-gold)]">
                    <span>
                      {spirit.points} / {SPIRIT_UNLOCK}
                      {spirit.stories.length ? ` · ${spirit.stories.length} efforts` : ""}
                    </span>
                    <span className="font-display tracking-[0.14em] text-[var(--sanctum-muted)] uppercase opacity-0 transition group-hover:opacity-100">
                      Open →
                    </span>
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </section>
      <AnimatePresence>
        {open ? <SpiritStorySheet spirit={open} onClose={() => setOpenId(null)} /> : null}
      </AnimatePresence>
    </>
  );
}

function SpiritStorySheet({
  spirit,
  onClose,
}: {
  spirit: ReturnType<typeof mergeSpiritRows>[number];
  onClose: () => void;
}) {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const fill = spiritFill(spirit.points);
  const awake = spirit.points >= SPIRIT_UNLOCK;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center">
      <motion.button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-[rgba(6,4,2,0.72)] backdrop-blur-sm"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="spirit-story-title"
        initial={reduced ? false : { opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduced ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-[28px] border border-[rgba(232,196,140,0.28)] bg-[linear-gradient(180deg,rgba(36,26,16,0.98),rgba(16,11,8,0.98))] p-6 shadow-[0_30px_80px_rgba(6,4,2,0.55),0_0_40px_rgba(228,180,92,0.12)]"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(ellipse_at_top,rgba(228,180,92,0.2),transparent_70%)]" />
        {!reduced ? (
          <div aria-hidden className="pointer-events-none absolute inset-0 sanctum-motes opacity-30" />
        ) : null}

        <div className="relative mb-4 h-44 overflow-hidden rounded-2xl bg-black/80">
          <motion.div
            className="absolute inset-0"
            animate={reduced ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src={spirit.image}
              alt={spirit.name}
              fill
              sizes="500px"
              className="object-contain p-3 drop-shadow-[0_0_28px_rgba(85,230,255,0.3)]"
            />
          </motion.div>
          {!reduced ? (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-1/2 size-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(85,230,255,0.2),transparent_65%)] blur-2xl"
              animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.94, 1.06, 0.94] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            />
          ) : null}
        </div>

        <div className="relative flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-display text-[10px] tracking-[0.28em] text-[var(--sanctum-gold)] uppercase">
              {spirit.trait}
              {awake ? " · Awake" : ""}
            </p>
            <h2 id="spirit-story-title" className="font-splash mt-1 text-3xl text-[var(--sanctum-ink)]">
              {spirit.name}
            </h2>
          </div>
          <p className="rounded-full border border-[rgba(228,180,92,0.35)] bg-[rgba(228,180,92,0.12)] px-3 py-1.5 font-display text-[10px] tracking-[0.16em] text-[var(--sanctum-gold)] uppercase">
            {spirit.points} / {SPIRIT_UNLOCK}
          </p>
        </div>

        <p className="relative mt-2 text-sm leading-6 text-[var(--sanctum-muted)]">{spirit.watches}</p>

        <div className="relative mt-4 h-1.5 overflow-hidden rounded-full bg-black/40">
          <motion.div
            className="h-full rounded-full bg-[linear-gradient(90deg,var(--sanctum-ember),var(--sanctum-gold))]"
            initial={reduced ? false : { width: 0 }}
            animate={{ width: `${Math.round(fill * 100)}%` }}
            transition={{ duration: reduced ? 0 : 0.85 }}
          />
        </div>

        <ol className="relative mt-6 space-y-3">
          {spirit.stories.length === 0 ? (
            <li className="rounded-2xl border border-[rgba(232,196,140,0.16)] px-4 py-3 text-sm text-[var(--sanctum-muted)]">
              This card is still quiet. Finish quests that match {spirit.name}, and their notices will
              appear here.
            </li>
          ) : (
            spirit.stories.map((story, index) => (
              <motion.li
                key={story.id}
                initial={reduced ? false : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: reduced ? 0 : 0.08 * index }}
                className="rounded-2xl border border-[rgba(232,196,140,0.16)] bg-[rgba(8,6,4,0.35)] px-4 py-3 transition hover:border-[rgba(228,180,92,0.4)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-display text-[10px] tracking-[0.22em] text-[var(--sanctum-gold)] uppercase">
                    {spirit.name} noticed you
                  </p>
                  {story.points > 0 ? (
                    <p className="shrink-0 text-xs text-[var(--sanctum-gold)]">+{story.points}</p>
                  ) : null}
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--sanctum-ink)]">
                  {story.reason || story.message}
                </p>
              </motion.li>
            ))
          )}
        </ol>

        <button
          type="button"
          onClick={onClose}
          className="relative mt-6 rounded-full border border-white/70 bg-white/10 px-6 py-2.5 font-display text-xs tracking-[0.16em] text-white uppercase transition hover:bg-white/20"
        >
          Close
        </button>
      </motion.div>
    </div>,
    document.body,
  );
}
