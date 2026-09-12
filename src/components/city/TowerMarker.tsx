"use client";

import { cn } from "@/lib/utils";
import type { TowerNode } from "@/lib/city/towers";
import { Lock, Sparkles, Zap } from "lucide-react";

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
        "group absolute z-20 -translate-x-1/2 -translate-y-1/2",
        "flex flex-col items-center gap-1.5 outline-none",
        locked ? "cursor-not-allowed" : "cursor-pointer",
      )}
      style={{ left: `${tower.x}%`, top: `${tower.y}%` }}
    >
      <span
        className={cn(
          "relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition duration-200",
          "border-[#9af3ff] bg-[#07111f]/80",
          "shadow-[0_0_16px_rgba(85,230,255,0.95),0_0_36px_rgba(85,230,255,0.55),0_0_56px_rgba(255,200,87,0.35)]",
          isSelected && "scale-110 ring-2 ring-[#ffc857]",
          isCurrent && "scale-125",
          isReachable && !isCurrent && "animate-pulse",
        )}
      >
        <span className="absolute inset-[-7px] rounded-full border border-[#55e6ff]/70 animate-ping" />
        <span className="absolute inset-[-3px] rounded-full bg-[#55e6ff]/20 blur-sm" />

        {locked ? (
          <Lock className="relative h-4 w-4 text-[#9af3ff]" />
        ) : isCurrent ? (
          <Sparkles className="relative h-4 w-4 text-[#ffc857]" />
        ) : (
          <Zap className="relative h-4 w-4 text-[#55e6ff]" />
        )}
      </span>

      <span
        className={cn(
          "pointer-events-none rounded-md border border-[#55e6ff]/35 bg-void/85 px-2 py-1 text-center backdrop-blur-md",
          "shadow-[0_0_16px_rgba(85,230,255,0.35)]",
          "opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100",
          (isSelected || isCurrent) && "opacity-100",
        )}
      >
        <span className="block font-display text-[9px] tracking-[0.18em] text-[#9af3ff] uppercase">
          {tower.name}
        </span>
        <span className="block text-[10px] text-[#ffc857]">Lv {tower.level}</span>
      </span>
    </button>
  );
}
