"use client";

import { useActionState, useState } from "react";
import { GameButton } from "@/components/ui/GameButton";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { GlowBadge } from "@/components/ui/GlowBadge";
import { CATEGORY_LABELS, DIFFICULTY_LABELS, DISTRICT_LABELS, CATEGORY_TO_DISTRICT } from "@/lib/constants";
import { updateQuestAction, type ActionState } from "@/modules/rpg/actions";
import { QUEST_CATEGORIES, QUEST_DIFFICULTIES } from "@/modules/rpg/catalog";
import { Field, fieldControlClass } from "@/modules/rpg/components/Field";
import type { RpgQuest } from "@/modules/rpg/types";

type QuestTileProps = {
  quest: RpgQuest;
  busy: boolean;
  onComplete: () => void;
  onDelete: () => void;
};

export function QuestTile({ quest, busy, onComplete, onDelete }: QuestTileProps) {
  const [editing, setEditing] = useState(false);
  const completed = quest.status === "completed";
  const district = CATEGORY_TO_DISTRICT[quest.category];

  return (
    <GlassPanel glow={completed ? "gold" : "cyan"} className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <GlowBadge tone={completed ? "gold" : "cyan"}>
          {completed ? "Restored" : DIFFICULTY_LABELS[quest.difficulty]}
        </GlowBadge>
        <p className="font-display text-sm text-heartlight">
          +{quest.xp_reward} XP · +{quest.shard_reward} shards
        </p>
      </div>

      {editing && !completed ? (
        <EditQuestForm quest={quest} onDone={() => setEditing(false)} />
      ) : (
        <>
          <h3 className="mt-4 font-display text-xl tracking-[0.1em] uppercase">{quest.title}</h3>
          {quest.description ? (
            <p className="mt-2 text-sm leading-6 text-muted">{quest.description}</p>
          ) : null}
          <p className="mt-3 text-xs tracking-[0.16em] text-muted uppercase">
            {CATEGORY_LABELS[quest.category]} · {DISTRICT_LABELS[district]}
          </p>
        </>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <GameButton
          size="sm"
          variant={completed ? "gold" : "primary"}
          disabled={completed || busy}
          onClick={onComplete}
        >
          {completed ? "Restored" : "Complete rite"}
        </GameButton>
        {!completed ? (
          <>
            <GameButton
              size="sm"
              variant="secondary"
              disabled={busy}
              onClick={() => setEditing((value) => !value)}
            >
              {editing ? "Close" : "Rewrite"}
            </GameButton>
            <GameButton size="sm" variant="ghost" disabled={busy} onClick={onDelete}>
              Unbind
            </GameButton>
          </>
        ) : null}
      </div>
    </GlassPanel>
  );
}

function EditQuestForm({ quest, onDone }: { quest: RpgQuest; onDone: () => void }) {
  const [state, action, pending] = useActionState(
    async (prev: ActionState, formData: FormData) => {
      const result = await updateQuestAction(prev, formData);
      if (result.ok) {
        onDone();
      }
      return result;
    },
    { ok: false } satisfies ActionState,
  );

  return (
    <form action={action} className="mt-4 grid gap-3">
      <input type="hidden" name="quest_id" value={quest.id} />
      <Field id={`edit-title-${quest.id}`} label="Quest name">
        <input
          id={`edit-title-${quest.id}`}
          name="title"
          required
          defaultValue={quest.title}
          maxLength={80}
          className={fieldControlClass}
        />
      </Field>
      <Field id={`edit-desc-${quest.id}`} label="Rite">
        <textarea
          id={`edit-desc-${quest.id}`}
          name="description"
          defaultValue={quest.description}
          maxLength={400}
          rows={3}
          className={`${fieldControlClass} h-auto py-3`}
        />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <select name="category" defaultValue={quest.category} className={fieldControlClass}>
          {QUEST_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {CATEGORY_LABELS[category]}
            </option>
          ))}
        </select>
        <select name="difficulty" defaultValue={quest.difficulty} className={fieldControlClass}>
          {QUEST_DIFFICULTIES.map((level) => (
            <option key={level} value={level}>
              {DIFFICULTY_LABELS[level]}
            </option>
          ))}
        </select>
      </div>
      <div aria-live="polite">
        {state.message ? <p className="text-sm text-warning">{state.message}</p> : null}
      </div>
      <GameButton type="submit" size="sm" disabled={pending}>
        {pending ? "Sealing…" : "Seal rewrite"}
      </GameButton>
    </form>
  );
}
