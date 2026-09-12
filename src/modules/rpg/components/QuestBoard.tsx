"use client";

import { useOptimistic, useState, useTransition } from "react";
import { RewardPopup } from "@/components/game/RewardPopup";
import { completeQuestAction, deleteQuestAction } from "@/modules/rpg/actions";
import { QuestComposer } from "@/modules/rpg/components/QuestComposer";
import { QuestTile } from "@/modules/rpg/components/QuestTile";
import { LevelBurst } from "@/modules/rpg/components/LevelBurst";
import type { CompleteQuestResult, RpgQuest } from "@/modules/rpg/types";

type QuestBoardProps = {
  quests: RpgQuest[];
};

export function QuestBoard({ quests }: QuestBoardProps) {
  const [optimistic, addOptimistic] = useOptimistic(
    quests,
    (current, next: { type: "complete" | "delete"; id: string }) => {
      if (next.type === "delete") {
        return current.filter((quest) => quest.id !== next.id);
      }
      return current.map((quest) =>
        quest.id === next.id ? { ...quest, status: "completed" as const } : quest,
      );
    },
  );
  const [pending, startTransition] = useTransition();
  const [reward, setReward] = useState<CompleteQuestResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"active" | "completed" | "all">("active");

  const visible = optimistic.filter((quest) => {
    if (filter === "all") return true;
    return quest.status === filter;
  });

  function onComplete(id: string) {
    setError(null);
    startTransition(async () => {
      addOptimistic({ type: "complete", id });
      const result = await completeQuestAction(id);
      if (!result.ok) {
        setError(result.message ?? "The city rejected the offering.");
        return;
      }
      if (result.data) {
        setReward(result.data);
      }
    });
  }

  function onDelete(id: string) {
    setError(null);
    startTransition(async () => {
      addOptimistic({ type: "delete", id });
      const result = await deleteQuestAction(id);
      if (!result.ok) {
        setError(result.message ?? "Could not unbind this quest.");
      }
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
      <QuestComposer />

      <section aria-labelledby="board-heading" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="board-heading" className="font-display text-2xl tracking-[0.14em] uppercase">
              Live board
            </h2>
            <p className="mt-1 text-sm text-muted">
              Complete a rite. Feel the city answer.
            </p>
          </div>
          <div className="flex gap-2" role="group" aria-label="Filter quests">
            {(["active", "completed", "all"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={
                  filter === value
                    ? "rounded-full bg-white/10 px-3 py-1.5 text-xs tracking-wide text-ink"
                    : "rounded-full px-3 py-1.5 text-xs tracking-wide text-muted hover:text-ink"
                }
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div aria-live="polite">
          {error ? <p className="text-sm text-warning">{error}</p> : null}
        </div>

        {visible.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/15 px-5 py-10 text-center text-sm text-muted">
            No quests in this filter. Inscribe one — even a scout rite counts.
          </p>
        ) : (
          <ul className="grid gap-4">
            {visible.map((quest) => (
              <li key={quest.id}>
                <QuestTile
                  quest={quest}
                  busy={pending}
                  onComplete={() => onComplete(quest.id)}
                  onDelete={() => onDelete(quest.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <RewardPopup
        open={Boolean(reward) && !reward?.leveled_up}
        onClose={() => setReward(null)}
        title={reward?.title ?? "Quest Complete"}
        subtitle={`${reward?.attribute ?? "signal"} brightens. Streak ${reward?.streak ?? 0}.`}
        xp={reward?.xp ?? 0}
        shards={reward?.shards ?? 0}
      />
      <LevelBurst
        open={Boolean(reward?.leveled_up)}
        level={reward?.level ?? 1}
        onClose={() => setReward(null)}
      />
    </div>
  );
}
