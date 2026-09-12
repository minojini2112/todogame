import { cn } from "@/lib/cn";
import { ProgressBar } from "@/components/ui/ProgressBar";

type XPBarProps = {
  current: number;
  required: number;
  level: number;
  className?: string;
};

export function XPBar({ current, required, level, className }: XPBarProps) {
  const safeRequired = Math.max(required, 1);
  const percent = (current / safeRequired) * 100;

  return (
    <div className={cn("min-w-44", className)}>
      <div className="mb-2 flex items-end justify-between gap-3">
        <p className="font-display text-[11px] uppercase tracking-[0.22em] text-muted">
          Level <span className="text-glow-cyan text-heartlight">{String(level).padStart(2, "0")}</span>
        </p>
        <p className="text-[11px] text-muted">
          <span className="text-ink">{current.toLocaleString()}</span> / {safeRequired.toLocaleString()} XP
        </p>
      </div>
      <ProgressBar value={percent} tone="cyan" />
    </div>
  );
}
