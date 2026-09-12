import { Flame, Gem, Sparkles } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { XPBar } from "@/components/ui/XPBar";
import { cn } from "@/lib/cn";

type GameHUDProps = {
  level: number;
  xp: number;
  xpRequired: number;
  shards: number;
  streak: number;
  location?: string;
  day?: number;
  floating?: boolean;
  className?: string;
};

export function GameHUD({
  level,
  xp,
  xpRequired,
  shards,
  streak,
  location = "Aurelia",
  day = 1,
  floating = true,
  className,
}: GameHUDProps) {
  return (
    <header
      className={cn(
        "z-50 w-full",
        floating ? "pointer-events-none fixed inset-x-0 top-0" : "relative",
        className,
      )}
    >
      <div className="pointer-events-auto mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <GlassPanel className="flex min-w-0 items-center gap-4 px-4 py-3">
          <div className="min-w-0">
            <p className="font-display text-[11px] tracking-[0.32em] text-heartlight">
              ECHOBOUND
            </p>
            <p className="truncate text-xs uppercase tracking-[0.18em] text-muted">
              {`${location} · Day ${day}`}
            </p>
          </div>
        </GlassPanel>

        <GlassPanel className="hidden items-center gap-5 px-4 py-3 md:flex">
          <XPBar current={xp} required={xpRequired} level={level} />
          <div className="h-8 w-px bg-white/10" />
          <p className="flex items-center gap-2 text-sm text-ink">
            <Gem className="size-4 text-signal" aria-hidden="true" />
            <span className="sr-only">Aether shards</span>
            {shards.toLocaleString()}
          </p>
          <p className="flex items-center gap-2 text-sm text-ink">
            <Flame className="size-4 text-cure" aria-hidden="true" />
            <span className="sr-only">Current streak</span>
            {streak} day streak
          </p>
        </GlassPanel>

        <GlassPanel className="flex items-center gap-3 px-3 py-3 md:hidden">
          <Sparkles className="size-4 text-heartlight" aria-hidden="true" />
          <p className="font-display text-sm text-heartlight">
            LV {String(level).padStart(2, "0")}
          </p>
          <p className="text-sm text-muted">{xp.toLocaleString()} XP</p>
        </GlassPanel>
      </div>
    </header>
  );
}
