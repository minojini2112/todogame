import { CATEGORY_LABELS, DIFFICULTY_LABELS, DISTRICT_LABELS } from "@/lib/constants";
import { GameButton } from "@/components/ui/GameButton";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { GlowBadge } from "@/components/ui/GlowBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { DistrictType, QuestCategory, QuestDifficulty, QuestStatus } from "@/types/game";

type QuestCardProps = {
  title: string;
  description: string;
  category: QuestCategory;
  difficulty?: QuestDifficulty;
  district?: DistrictType;
  xpReward: number;
  progress?: number;
  status?: QuestStatus;
  onBegin?: () => void;
};

export function QuestCard({
  title,
  description,
  category,
  difficulty = "ranger",
  district,
  xpReward,
  progress = 0,
  status = "active",
  onBegin,
}: QuestCardProps) {
  const completed = status === "completed";

  return (
    <GlassPanel
      as="article"
      glow={completed ? "gold" : "cyan"}
      className="flex flex-col gap-5 p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <GlowBadge tone={completed ? "gold" : "cyan"}>
          {completed ? "Complete" : DIFFICULTY_LABELS[difficulty]}
        </GlowBadge>
        <p className="font-display text-sm font-semibold text-heartlight">+{xpReward} XP</p>
      </div>

      <div>
        <h3 className="font-display text-xl uppercase tracking-[0.12em] text-ink">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
      </div>

      <ProgressBar
        value={completed ? 100 : progress}
        label={CATEGORY_LABELS[category]}
        tone={completed ? "gold" : "cyan"}
      />

      <div className="flex items-center justify-between gap-3">
        {district ? (
          <p className="text-xs uppercase tracking-[0.16em] text-muted">
            <span className="mr-2 text-heartlight">◈</span>
            {DISTRICT_LABELS[district]}
          </p>
        ) : (
          <span />
        )}
        <GameButton
          size="sm"
          variant={completed ? "gold" : "primary"}
          disabled={completed}
          onClick={onBegin}
        >
          {completed ? "Restored" : "Begin Quest"}
        </GameButton>
      </div>
    </GlassPanel>
  );
}
