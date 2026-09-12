"use client";

import { useActionState, useState } from "react";
import { motion } from "framer-motion";
import { QUEST_PRIORITIES } from "@/modules/rpg/catalog";
import { updateQuestAction, type ActionState } from "@/modules/rpg/actions";
import { RepeatFields } from "@/modules/rpg/components/RepeatFields";
import { formatBound, formatDue, formatRepeat, formatRepeatDone, toLocalInput } from "@/modules/rpg/format";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { RpgGroup, RpgPriority, RpgQuest } from "@/modules/rpg/types";

const priorityTone: Record<RpgPriority, string> = {
  ember: "text-[#f0a07a]",
  gold: "text-[var(--sanctum-gold)]",
  ash: "text-[var(--sanctum-muted)]",
  mist: "text-[var(--sanctum-water)]",
};

type CodexRiteRowProps = {
  quest: RpgQuest;
  groups: RpgGroup[];
  busy: boolean;
  onComplete: () => void;
  onDelete: () => void;
};

export function CodexRiteRow({
  quest,
  groups,
  busy,
  onComplete,
  onDelete,
}: CodexRiteRowProps) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const done = quest.status === "completed";
  const overdue = Boolean(quest.due_at && !done && new Date(quest.due_at).getTime() < Date.now());

  return (
    <motion.article
      layout={!reduced}
      whileHover={reduced || done ? undefined : { y: -2 }}
      className="sanctum-rite group rounded-2xl border border-[rgba(232,196,140,0.32)] bg-[rgba(18,13,9,0.55)] px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:border-[rgba(228,180,92,0.55)]"
    >
      <div
        draggable={!done}
        onDragStart={(event) => {
          event.dataTransfer.setData("text/quest-id", quest.id);
          event.dataTransfer.effectAllowed = "move";
        }}
        className="flex items-start gap-2"
      >
        <motion.button
          type="button"
          aria-label={done ? `${quest.title} completed` : `Complete quest ${quest.title}`}
          disabled={done || busy}
          onClick={onComplete}
          whileTap={reduced || done ? undefined : { scale: 0.86 }}
          className="sanctum-seal mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-[rgba(232,196,140,0.35)] text-[10px] text-[#1a1208] transition disabled:opacity-70"
          style={{
            background: done ? "var(--sanctum-gold)" : "transparent",
            boxShadow: done ? "0 0 14px rgba(228,180,92,0.55)" : undefined,
          }}
        >
          {done ? "✦" : ""}
        </motion.button>

        <button
          type="button"
          className="min-w-0 flex-1 text-left"
          onClick={() => setOpen((value) => !value)}
        >
          <p
            className={`text-sm leading-5 ${
              done ? "text-[var(--sanctum-muted)] line-through" : "text-[var(--sanctum-ink)]"
            }`}
          >
            {quest.title}
          </p>
          <p className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-[var(--sanctum-muted)]">
            <span className={priorityTone[quest.priority]}>
              {QUEST_PRIORITIES.find((item) => item.id === quest.priority)?.label ?? quest.priority}
            </span>
            <span className={overdue ? "text-[#f0a07a]" : undefined}>{formatDue(quest.due_at)}</span>
            {formatRepeat(quest) ? (
              <span className="text-[var(--sanctum-gold)]">{formatRepeat(quest)}</span>
            ) : null}
            <span className="text-[var(--sanctum-gold)]/80">+{quest.xp_reward} XP</span>
          </p>
        </button>
      </div>

      {open ? (
        <motion.div
          initial={reduced ? false : { opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 overflow-hidden border-t border-[rgba(232,196,140,0.12)] pt-3"
        >
          {quest.description ? (
            <p className="mb-3 text-sm leading-6 text-[var(--sanctum-muted)]">{quest.description}</p>
          ) : null}
          {done ? (
            <p className="mb-3 text-xs text-[var(--sanctum-gold)]">
              {formatRepeatDone(quest) ??
                `Completed ${quest.completed_at ? formatBound(quest.completed_at) : ""}`}
            </p>
          ) : null}
          {!done || quest.repeat_rule !== "none" ? (
            <EditRiteForm quest={quest} groups={groups} onDone={() => setOpen(false)} onDelete={onDelete} />
          ) : null}
        </motion.div>
      ) : null}
    </motion.article>
  );
}

function EditRiteForm({
  quest,
  groups,
  onDone,
  onDelete,
}: {
  quest: RpgQuest;
  groups: RpgGroup[];
  onDone: () => void;
  onDelete: () => void;
}) {
  const [state, action, pending] = useActionState(
    async (prev: ActionState, formData: FormData) => {
      const result = await updateQuestAction(prev, formData);
      if (result.ok) onDone();
      return result;
    },
    { ok: false } satisfies ActionState,
  );

  return (
    <form action={action} className="grid gap-3">
      <input type="hidden" name="quest_id" value={quest.id} />
      <input type="hidden" name="list_id" value={quest.list_id ?? ""} />
      <input
        name="title"
        required
        defaultValue={quest.title}
        className={inputClass}
        aria-label="Quest name"
      />
      <textarea
        name="description"
        defaultValue={quest.description}
        rows={2}
        className={`${inputClass} h-auto py-2`}
        aria-label="Notes"
      />
      <div className="grid gap-2 sm:grid-cols-2">
        <select name="group_id" defaultValue={quest.group_id ?? ""} className={inputClass} aria-label="Group">
          <option value="">No group</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.title}
            </option>
          ))}
        </select>
        <select name="priority" defaultValue={quest.priority} className={inputClass} aria-label="Priority">
          {QUEST_PRIORITIES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
        <input
          type="datetime-local"
          name="due_at"
          defaultValue={toLocalInput(quest.due_at)}
          className={inputClass}
          aria-label="Due date"
        />
        <RepeatFields
          fieldClass={inputClass}
          defaultRule={quest.repeat_rule ?? "none"}
          defaultEvery={quest.repeat_every ?? 1}
          defaultUnit={quest.repeat_unit ?? "day"}
        />
      </div>
      <div aria-live="polite">
        {state.message ? <p className="text-sm text-[#f0a07a]">{state.message}</p> : null}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-[var(--sanctum-gold)] px-4 py-2 font-display text-[11px] tracking-[0.14em] text-[#1a1208] uppercase"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-full px-4 py-2 text-sm text-[var(--sanctum-muted)] transition hover:text-[#f0a07a]"
        >
          Delete
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "h-10 w-full rounded-lg border border-[rgba(232,196,140,0.16)] bg-[rgba(10,8,6,0.45)] px-3 text-sm text-[var(--sanctum-ink)] outline-none transition focus-visible:border-[var(--sanctum-gold)] focus-visible:shadow-[0_0_0_3px_rgba(228,180,92,0.12)]";
