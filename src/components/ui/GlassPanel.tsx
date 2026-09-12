import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { GlowTone } from "@/types/game";

const glowClass: Record<GlowTone, string> = {
  none: "shadow-[0_0_40px_rgba(0,0,0,0.25)]",
  cyan: "shadow-[0_0_40px_rgba(85,230,255,0.16)]",
  gold: "shadow-[0_0_40px_rgba(255,200,87,0.18)]",
  violet: "shadow-[0_0_40px_rgba(157,123,255,0.16)]",
  green: "shadow-[0_0_40px_rgba(114,241,184,0.14)]",
};

type GlassPanelProps = {
  children: ReactNode;
  className?: string;
  glow?: GlowTone;
  as?: ElementType;
};

export function GlassPanel({
  children,
  className,
  glow = "none",
  as: Tag = "div",
}: GlassPanelProps) {
  return (
    <Tag
      className={cn(
        "relative rounded-2xl border border-white/10 bg-glass backdrop-blur-xl",
        glowClass[glow],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
