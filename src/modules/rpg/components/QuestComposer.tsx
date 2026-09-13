"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { GameButton } from "@/components/ui/GameButton";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { CATEGORY_LABELS, DIFFICULTY_LABELS } from "@/lib/constants";
import {
  DIFFICULTY_PAYOUT,
  QUEST_CATEGORIES,
  QUEST_DIFFICULTIES,
} from "@/modules/rpg/catalog";
import { createQuestAction, type ActionState } from "@/modules/rpg/actions";
import { Field, fieldControlClass } from "@/modules/rpg/components/Field";
import { playSfx } from "@/lib/sfx";
import type { QuestDifficulty } from "@/types/game";

const initial: ActionState = { ok: false };

export function QuestComposer() {
  const [state, action, pending] = useActionState(createQuestAction, initial);
  const [difficulty, setDifficulty] = useState<QuestDifficulty>("ranger");
  const formRef = useRef<HTMLFormElement>(null);
  const celebrated = useRef(false);
  const payout = DIFFICULTY_PAYOUT[difficulty];

  useEffect(() => {
    if (pending) {
      celebrated.current = false;
      return;
    }
    if (state.ok && !celebrated.current) {
      celebrated.current = true;
      playSfx("added");
      formRef.current?.reset();
      setDifficulty("ranger");
    }
  }, [pending, state]);

  return (
    <GlassPanel glow="cyan" className="p-5 sm:p-6">
      <h2 className="font-display text-lg tracking-[0.16em] uppercase">Inscribe a quest</h2>
      <p className="mt-1 text-sm text-muted">
        Real work. Instant signal. Rewards are sealed by the city — you cannot forge XP here.
      </p>

      <form ref={formRef} action={action} className="mt-5 grid gap-4">
        <Field id="title" label="Quest name">
          <input
            id="title"
            name="title"
            required
            maxLength={80}
            placeholder="Solve one focused problem"
            className={fieldControlClass}
          />
        </Field>
        <Field id="description" label="Rite">
          <textarea
            id="description"
            name="description"
            maxLength={400}
            rows={3}
            placeholder="What does restored Heartlight look like when this is done?"
            className={`${fieldControlClass} h-auto py-3`}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="category" label="Path">
            <select id="category" name="category" defaultValue="focus" className={fieldControlClass}>
              {QUEST_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {CATEGORY_LABELS[category]}
                </option>
              ))}
            </select>
          </Field>
          <Field id="difficulty" label="Weight">
            <select
              id="difficulty"
              name="difficulty"
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value as QuestDifficulty)}
              className={fieldControlClass}
            >
              {QUEST_DIFFICULTIES.map((level) => (
                <option key={level} value={level}>
                  {DIFFICULTY_LABELS[level]}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <p className="text-sm text-heartlight">
          City seal: +{payout.xp} XP · +{payout.shards} shards
        </p>

        <div aria-live="polite">
          {state.message ? <p className="text-sm text-warning">{state.message}</p> : null}
        </div>

        <GameButton type="submit" disabled={pending}>
          {pending ? "Binding…" : "Bind quest"}
        </GameButton>
      </form>
    </GlassPanel>
  );
}
