"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { mergeSpiritRows, spiritFill, SPIRIT_UNLOCK } from "@/modules/rpg/spirits";
import type { RpgSpiritProgress, RpgSpiritStory } from "@/modules/rpg/types";

export function SpiritCards({
  spirits,
  stories,
}: {
  spirits: RpgSpiritProgress[];
  stories: RpgSpiritStory[];
}) {
  const rows = mergeSpiritRows(spirits, stories);
  const [openId, setOpenId] = useState<(typeof rows)[number]["id"] | null>(null);
  const open = rows.find((spirit) => spirit.id === openId) ?? null;

  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2">
        {rows.map((spirit) => {
          const fill = spiritFill(spirit.points);
          const awake = spirit.points >= SPIRIT_UNLOCK;
          return (
            <button
              key={spirit.id}
              type="button"
              onClick={() => setOpenId(spirit.id)}
              className="overflow-hidden rounded-[24px] border border-[rgba(232,196,140,0.22)] bg-[rgba(12,9,7,0.55)] text-left"
            >
              <div className="relative h-56 w-full bg-black sm:h-64">
                <Image
                  src={spirit.image}
                  alt={spirit.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 40vw"
                  className={spirit.id === "eagle" ? "object-contain p-3" : "object-cover object-center"}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[rgba(12,9,7,0.95)] to-transparent"
                />
              </div>
              <div className="relative p-4">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 bg-[rgba(228,180,92,0.16)]"
                  style={{ height: `${Math.round(fill * 100)}%` }}
                />
                <div className="relative">
                  <p className="text-xs tracking-[0.2em] text-[var(--sanctum-gold)] uppercase">{spirit.trait}</p>
                  <h3 className="font-splash mt-1 text-2xl text-[var(--sanctum-ink)]">{spirit.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--sanctum-muted)]">{spirit.watches}</p>
                  <p className="mt-3 text-xs text-[var(--sanctum-gold)]">
                    {spirit.points} / {SPIRIT_UNLOCK}
                    {awake ? " · Awake" : ""}
                    {spirit.stories.length ? ` · ${spirit.stories.length} efforts` : ""}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </section>
      {open ? <SpiritStorySheet spirit={open} onClose={() => setOpenId(null)} /> : null}
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-[rgba(6,4,2,0.72)] backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="spirit-story-title"
        className="relative max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-[28px] border border-[rgba(232,196,140,0.28)] bg-[linear-gradient(180deg,rgba(36,26,16,0.98),rgba(16,11,8,0.98))] p-6 shadow-[0_30px_80px_rgba(6,4,2,0.55)]"
      >
        <div className="relative mb-4 h-36 overflow-hidden rounded-2xl bg-black">
          <Image
            src={spirit.image}
            alt={spirit.name}
            fill
            sizes="500px"
            className={spirit.id === "eagle" ? "object-contain p-2" : "object-cover object-center"}
          />
        </div>
        <p className="text-[11px] tracking-[0.28em] text-[var(--sanctum-gold)] uppercase">{spirit.trait}</p>
        <h2 id="spirit-story-title" className="font-splash mt-1 text-3xl text-[var(--sanctum-ink)]">
          {spirit.name}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--sanctum-muted)]">{spirit.watches}</p>

        <ol className="mt-6 space-y-3">
          {spirit.stories.length === 0 ? (
            <li className="rounded-2xl border border-[rgba(232,196,140,0.16)] px-4 py-3 text-sm text-[var(--sanctum-muted)]">
              This card is still quiet. Finish work that matches {spirit.name}, and the reason will be written here.
            </li>
          ) : (
            spirit.stories.map((story) => (
              <li
                key={story.id}
                className="rounded-2xl border border-[rgba(232,196,140,0.16)] bg-[rgba(8,6,4,0.35)] px-4 py-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[10px] tracking-[0.22em] text-[var(--sanctum-gold)] uppercase">
                    {spirit.name} noticed you
                  </p>
                  {story.points > 0 ? (
                    <p className="shrink-0 text-xs text-[var(--sanctum-gold)]">+{story.points}</p>
                  ) : null}
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--sanctum-ink)]">
                  {story.reason || story.message}
                </p>
              </li>
            ))
          )}
        </ol>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 rounded-full bg-[var(--sanctum-gold)] px-6 py-2.5 text-sm text-[#1a1208]"
        >
          Close
        </button>
      </div>
    </div>,
    document.body,
  );
}
