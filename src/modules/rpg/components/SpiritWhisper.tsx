"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { spiritById } from "@/modules/rpg/spirits";
import type { RpgSpiritWhisper } from "@/modules/rpg/types";

export function SpiritWhisper({
  whisper,
  onDismiss,
}: {
  whisper: RpgSpiritWhisper | null;
  onDismiss?: () => void;
}) {
  const [live, setLive] = useState<RpgSpiritWhisper | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!whisper?.message) return;
    setLive(whisper);
  }, [whisper]);

  function hide() {
    setLive(null);
    onDismiss?.();
  }

  if (!mounted || !live?.message) return null;
  const spirit = spiritById(live.spirit_id);

  return createPortal(
    <aside className="pointer-events-none fixed inset-x-0 bottom-0 z-[70]">
      <div className="bg-[linear-gradient(180deg,transparent,rgba(4,6,10,0.88)_40%,rgba(4,6,10,0.96))] px-4 pb-3 pt-6 sm:px-8 sm:pb-4">
        <div className="pointer-events-auto mx-auto flex max-w-4xl items-center gap-3">
          <div className="min-w-0 flex-1 rounded-full border border-white/10 bg-[rgba(8,12,18,0.94)] px-5 py-2.5">
            <p className="text-[10px] tracking-[0.28em] text-white/45 uppercase">{spirit.name}</p>
            <p className="mt-0.5 text-sm leading-5 text-white/90">{live.message}</p>
          </div>
          <button
            type="button"
            onClick={hide}
            className="shrink-0 rounded-full border border-white/15 bg-[rgba(8,12,18,0.94)] px-5 py-2.5 text-[11px] tracking-[0.22em] text-white/80 uppercase"
          >
            Next →
          </button>
        </div>
      </div>
    </aside>,
    document.body,
  );
}
