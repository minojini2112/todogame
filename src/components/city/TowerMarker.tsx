"use client";

import { cn } from "@/lib/utils";
import type { TowerNode, TowerStatus } from "@/lib/city/towers";
import { Lock, Sparkles, Zap } from "lucide-react";

const STATUS_RING: Record<TowerStatus, string> = {
  restored: "border-heal shadow-[0_0_18px_rgba(114,241,184,0.55)]",
  active: "border-cyan shadow-[0_0_20px_rgba(85,230,255,0.6)]",
  damaged: "border-gold/80 shadow-[0_0_14px_rgba(255,200,87,0.35)]",
  locked: "border-muted/40 opacity-70",
};

type Props = {
  tower: TowerNode;
  isCurrent: boolean;
  isSelected: boolean;
  isReachable: boolean;
  unlocked: boolean;
  onSelect: () => void;
};

export default function TowerMarker({
  tower,
  isCurrent,
  isSelected,
  isReachable,
  unlocked,
  onSelect,
}: Props) {
  const locked = tower.status === "locked" || !unlocked;

  return (
    <button
      type="button"
      aria-label={`${tower.name}, level ${tower.level}${locked ? ", locked" : ""}`}
      aria-current={isCurrent ? "true" : undefined}
      disabled={locked && !isSelected}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={cn(
        "group absolute -translate-x-1/2 -translate-y-1/2 z-20",
        "flex flex-col items-center gap-1.5 outline-none",
        locked ? "cursor-not-allowed" : "cursor-pointer",
      )}
      style={{ left: `${tower.x}%`, top: `${tower.y}%` }}
    >
      <span
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-full border-2 bg-void/75 backdrop-blur-sm transition duration-200",
          STATUS_RING[tower.status],
          isSelected && "scale-110 ring-2 ring-cyan/50",
          isCurrent && "scale-125",
          isReachable && !isCurrent && "animate-pulse",
        )}
      >
        {locked ? (
          <Lock className="h-3.5 w-3.5 text-muted" />
        ) : isCurrent ? (
          <Sparkles className="h-3.5 w-3.5 text-cyan" />
        ) : (
          <Zap className="h-3.5 w-3.5 text-gold" />
        )}

        {isCurrent && (
          <span className="absolute inset-[-6px] rounded-full border border-cyan/40 animate-ping" />
        )}
      </span>

      <span
        className={cn(
          "pointer-events-none rounded-md border border-white/10 bg-void/80 px-2 py-1 text-center backdrop-blur-md",
          "opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100",
          (isSelected || isCurrent) && "opacity-100",
        )}
      >
        <span className="block font-display text-[9px] tracking-[0.18em] text-text uppercase">
          {tower.name}
        </span>
        <span className="block text-[10px] text-muted">Lv {tower.level}</span>
      </span>
    </button>
  );
}
