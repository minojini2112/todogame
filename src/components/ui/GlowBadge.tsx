import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { BarTone } from "@/types/game";

const toneClass: Record<BarTone, string> = {
  cyan: "border-heartlight/30 bg-heartlight/10 text-heartlight",
  gold: "border-cure/30 bg-cure/10 text-cure",
  green: "border-healing/30 bg-healing/10 text-healing",
  violet: "border-signal/30 bg-signal/10 text-signal",
  coral: "border-warning/30 bg-warning/10 text-warning",
};

type GlowBadgeProps = {
  children: ReactNode;
  tone?: BarTone;
  className?: string;
};

export function GlowBadge({ children, tone = "cyan", className }: GlowBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-display text-[10px] font-semibold uppercase tracking-[0.18em]",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
