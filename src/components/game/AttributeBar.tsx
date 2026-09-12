import { ATTRIBUTE_LABELS } from "@/lib/constants";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { AttributeName, BarTone } from "@/types/game";

const attributeTone: Record<AttributeName, BarTone> = {
  focus: "cyan",
  endurance: "violet",
  recovery: "green",
  creativity: "gold",
  resolve: "coral",
};

type AttributeBarProps = {
  name: AttributeName;
  value: number;
  max?: number;
};

export function AttributeBar({ name, value, max = 20 }: AttributeBarProps) {
  const percent = (value / max) * 100;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="font-display text-xs uppercase tracking-[0.18em] text-muted">
          {ATTRIBUTE_LABELS[name]}
        </p>
        <p className="text-sm text-ink">
          {value}
          <span className="text-muted"> / {max}</span>
        </p>
      </div>
      <ProgressBar value={percent} tone={attributeTone[name]} />
    </div>
  );
}
