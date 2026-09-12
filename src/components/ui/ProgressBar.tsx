import { cn } from "@/lib/cn";
import type { BarTone } from "@/types/game";

const toneClass: Record<BarTone, string> = {
  cyan: "bg-heartlight shadow-[0_0_12px_rgba(85,230,255,0.45)]",
  gold: "bg-cure shadow-[0_0_12px_rgba(255,200,87,0.4)]",
  green: "bg-healing shadow-[0_0_12px_rgba(114,241,184,0.4)]",
  violet: "bg-signal shadow-[0_0_12px_rgba(157,123,255,0.4)]",
  coral: "bg-warning shadow-[0_0_12px_rgba(255,107,107,0.35)]",
};

type ProgressBarProps = {
  value: number;
  label?: string;
  tone?: BarTone;
  className?: string;
};

export function ProgressBar({
  value,
  label,
  tone = "cyan",
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("w-full", className)}>
      {label ? (
        <div className="mb-2 flex items-center justify-between gap-3 text-xs uppercase tracking-[0.18em] text-muted">
          <span>{label}</span>
          <span className="text-ink">{Math.round(clamped)}%</span>
        </div>
      ) : null}
      <div
        className="h-1.5 overflow-hidden rounded-full bg-white/10"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(clamped)}
        aria-label={label}
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-700 ease-out motion-reduce:transition-none",
            toneClass[tone],
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
