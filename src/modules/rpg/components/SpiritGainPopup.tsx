"use client";

import Image from "next/image";
import { spiritById } from "@/modules/rpg/spirits";
import type { RpgSpiritId } from "@/modules/rpg/types";

export function SpiritGainPopup({
  open,
  title,
  spiritId,
  points,
  onClose,
}: {
  open: boolean;
  title: string;
  spiritId: RpgSpiritId | null;
  points: number;
  onClose: () => void;
}) {
  if (!open || !spiritId || points < 1) return null;
  const spirit = spiritById(spiritId);

  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-[rgba(6,4,2,0.72)] backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="spirit-gain-title"
        className="relative w-full max-w-md rounded-[28px] border border-[rgba(232,196,140,0.28)] bg-[linear-gradient(180deg,rgba(36,26,16,0.98),rgba(16,11,8,0.98))] p-8 text-center shadow-[0_30px_80px_rgba(6,4,2,0.55)]"
      >
        <div className="relative mx-auto mb-5 h-40 w-full overflow-hidden rounded-2xl bg-black">
          <Image
            src={spirit.image}
            alt={spirit.name}
            fill
            sizes="400px"
            className="object-contain p-2"
          />
        </div>
        <p className="text-[11px] tracking-[0.28em] text-[var(--sanctum-gold)] uppercase">{spirit.trait}</p>
        <h2 id="spirit-gain-title" className="font-splash mt-2 text-3xl text-[var(--sanctum-ink)]">
          {spirit.name}
        </h2>
        <p className="mt-2 text-sm text-[var(--sanctum-muted)]">{title}</p>
        <p className="mt-6 font-splash text-5xl text-[var(--sanctum-gold)] text-glow-gold">+{points}</p>
        <p className="mt-2 text-sm text-[var(--sanctum-muted)]">spirit points earned</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-8 rounded-full bg-[var(--sanctum-gold)] px-6 py-2.5 font-display text-xs tracking-[0.16em] text-[#1a1208] uppercase"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
