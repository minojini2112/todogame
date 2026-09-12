"use client";

import { useActionState, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { SpiritGainPopup } from "@/modules/rpg/components/SpiritGainPopup";
import { QUEST_PRIORITIES } from "@/modules/rpg/catalog";
import {
  completeQuestAction,
  createGroupAction,
  createListAction,
  createQuestAction,
  deleteGroupAction,
  deleteListAction,
  deleteQuestAction,
  moveQuestAction,
  renameGroupAction,
  type ActionState,
} from "@/modules/rpg/actions";
import { CodexRiteRow } from "@/modules/rpg/components/CodexRiteRow";
import { RepeatFields } from "@/modules/rpg/components/RepeatFields";
import { LevelBurst } from "@/modules/rpg/components/LevelBurst";
import { SpiritWhisper } from "@/modules/rpg/components/SpiritWhisper";
import type { CompleteQuestResult, RpgGroup, RpgList, RpgQuest, RpgSpiritWhisper } from "@/modules/rpg/types";

type CodexWorkspaceProps = {
  lists: RpgList[];
  groups: RpgGroup[];
  quests: RpgQuest[];
  whisper: RpgSpiritWhisper | null;
};

type BoardColumn = {
  id: string | null;
  title: string;
  quests: RpgQuest[];
  canManage: boolean;
};

export function CodexWorkspace({ lists, groups, quests, whisper }: CodexWorkspaceProps) {
  const [listId, setListId] = useState<string | null>(lists[0]?.id ?? null);
  const [pending, startTransition] = useTransition();
  const [reward, setReward] = useState<CompleteQuestResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [liveWhisper, setLiveWhisper] = useState<RpgSpiritWhisper | null>(null);
  const [showDone, setShowDone] = useState(false);
  const [composer, setComposer] = useState<{ listId: string; groupId: string; groupTitle: string } | null>(
    null,
  );

  const activeList = listId ? (lists.find((list) => list.id === listId) ?? null) : null;
  const listGroups = useMemo(
    () => groups.filter((group) => group.list_id === activeList?.id).sort((a, b) => a.sort_order - b.sort_order),
    [groups, activeList?.id],
  );
  const listQuests = useMemo(
    () =>
      activeList
        ? quests.filter((quest) => quest.list_id === activeList.id)
        : quests.filter((quest) => !quest.list_id),
    [quests, activeList],
  );
  const visible = (quest: RpgQuest) =>
    showDone ? quest.status === "completed" : quest.status === "active";

  const columns = useMemo<BoardColumn[]>(() => {
    const loose = listQuests.filter((quest) => !quest.group_id && visible(quest));
    const groupColumns = listGroups.map((group) => ({
      id: group.id,
      title: group.title,
      quests: listQuests.filter((quest) => quest.group_id === group.id && visible(quest)),
      canManage: true,
    }));

    if (!activeList) {
      return loose.length
        ? [{ id: null, title: "Inbox", quests: loose, canManage: false }]
        : [];
    }

    return groupColumns;
  }, [activeList, listGroups, listQuests, showDone]);

  useEffect(() => {
    if (listId && !lists.some((list) => list.id === listId)) {
      setListId(lists[0]?.id ?? null);
    }
  }, [lists, listId]);

  function run(work: () => Promise<ActionState>, fallback: string) {
    setError(null);
    startTransition(async () => {
      const result = await work();
      if (!result.ok) setError(result.message ?? fallback);
    });
  }

  function complete(id: string) {
    setError(null);
    startTransition(async () => {
      const result = await completeQuestAction(id);
      if (!result.ok) {
        setError(result.message ?? "Could not complete the task.");
        return;
      }
      if (result.data) setReward(result.data);
      if (result.data?.whisper) setLiveWhisper(result.data.whisper);
    });
  }

  return (
    <div className="sanctum-panel mx-auto max-w-[1400px] rounded-[32px] border border-[rgba(232,196,140,0.28)] p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-[var(--sanctum-gold)]">Lists</p>
          <p className="mt-1 text-sm text-[var(--sanctum-muted)]">
            Press a list to open its groups.
          </p>
        </div>
        <div className="flex gap-3 text-xs">
          <button
            type="button"
            onClick={() => setShowDone(false)}
            className={!showDone ? "text-[var(--sanctum-gold)]" : "text-[var(--sanctum-muted)]"}
          >
            Active
          </button>
          <button
            type="button"
            onClick={() => setShowDone(true)}
            className={showDone ? "text-[var(--sanctum-gold)]" : "text-[var(--sanctum-muted)]"}
          >
            Completed
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2" role="tablist" aria-label="Lists">
        <ListTab
          label="Inbox"
          active={!activeList}
          onClick={() => setListId(null)}
        />
        {lists.map((list) => (
          <ListTab
            key={list.id}
            label={list.title}
            active={list.id === activeList?.id}
            onClick={() => setListId(list.id)}
          />
        ))}
        <NewNameForm
          compact
          placeholder="New list"
          submitLabel="Add"
          onSubmit={async (title) => {
            const result = await createListAction(title);
            if (!result.ok) {
              setError(result.message ?? "Could not create list.");
              return;
            }
            if (result.id) setListId(result.id);
          }}
        />
        {activeList ? (
          <button
            type="button"
            className="px-2 text-xs text-[var(--sanctum-muted)] hover:text-[#f0a07a]"
            onClick={() =>
              run(async () => {
                const result = await deleteListAction(activeList.id);
                if (result.ok) setListId(null);
                return result;
              }, "Could not delete list.")
            }
          >
            Delete list
          </button>
        ) : null}
      </div>

      <div aria-live="polite" className="min-h-5">
        {error ? <p className="pt-3 text-sm text-[#f0a07a]">{error}</p> : null}
      </div>

      <div className="mt-5 flex gap-5 overflow-x-auto pb-3">
        {!activeList && !showDone && columns.length === 0 ? (
          <button
            type="button"
            onClick={() => setComposer({ listId: "", groupId: "", groupTitle: "Inbox" })}
            className="flex size-8 items-center justify-center rounded-full border border-[rgba(228,180,92,0.45)] bg-[rgba(228,180,92,0.16)] text-lg leading-none text-[var(--sanctum-gold)]"
            aria-label="Add an inbox task"
          >
            +
          </button>
        ) : null}
        {columns.map((column) => (
          <GroupColumn
            key={column.id ?? "ungrouped"}
            title={column.title}
            count={column.quests.length}
            canManage={column.canManage}
            onDropTask={(questId) =>
              run(() => moveQuestAction(questId, column.id), "Could not move the task.")
            }
            onRename={
              column.id
                ? async (title) => {
                    const result = await renameGroupAction(column.id as string, title);
                    if (!result.ok) setError(result.message ?? "Could not rename group.");
                  }
                : undefined
            }
            onDelete={
              column.id
                ? () => run(() => deleteGroupAction(column.id as string), "Could not delete group.")
                : undefined
            }
            onAdd={
              showDone
                ? undefined
                : () =>
                    setComposer({
                      listId: activeList?.id ?? "",
                      groupId: column.id ?? "",
                      groupTitle: column.title,
                    })
            }
          >
            {column.quests.map((quest) => (
              <CodexRiteRow
                key={quest.id}
                quest={quest}
                groups={listGroups}
                busy={pending}
                onComplete={() => complete(quest.id)}
                onDelete={() => run(() => deleteQuestAction(quest.id), "Could not delete the task.")}
              />
            ))}
          </GroupColumn>
        ))}

        {activeList && !showDone ? (
          <article className="flex w-[260px] shrink-0 flex-col rounded-[28px] border border-dashed border-[rgba(232,196,140,0.35)] p-4">
            <p className="text-center text-sm text-[var(--sanctum-gold)]">New group</p>
            <p className="mt-2 text-center text-xs text-[var(--sanctum-muted)]">
              Adds another column on this list.
            </p>
            <NewNameForm
              placeholder="Group name"
              submitLabel="Add group"
              onSubmit={async (title) => {
                const result = await createGroupAction(activeList.id, title);
                if (!result.ok) setError(result.message ?? "Could not create group.");
              }}
            />
          </article>
        ) : null}
      </div>
      {composer ? (
        <TaskComposerModal
          listId={composer.listId}
          groupId={composer.groupId}
          groupTitle={composer.groupTitle}
          onClose={() => setComposer(null)}
        />
      ) : null}
      <SpiritWhisper whisper={liveWhisper} onDismiss={() => setLiveWhisper(null)} />
      <SpiritGainPopup
        open={Boolean(reward) && !reward?.leveled_up}
        title={reward?.title ?? "Task complete"}
        spiritId={reward?.spirit_id ?? null}
        points={reward?.spirit_points ?? 0}
        onClose={() => setReward(null)}
      />
      <LevelBurst
        open={Boolean(reward?.leveled_up)}
        level={reward?.level ?? 1}
        onClose={() => setReward(null)}
      />
    </div>
  );
}

function ListTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={
        active
          ? "rounded-full border border-[rgba(228,180,92,0.55)] bg-[rgba(228,180,92,0.18)] px-4 py-2 text-sm"
          : "rounded-full border border-[rgba(232,196,140,0.2)] px-4 py-2 text-sm text-[var(--sanctum-muted)] hover:border-[rgba(232,196,140,0.4)]"
      }
    >
      {label}
    </button>
  );
}

function GroupColumn({
  title,
  count,
  canManage,
  children,
  onDropTask,
  onRename,
  onDelete,
  onAdd,
}: {
  title: string;
  count: number;
  canManage: boolean;
  children: React.ReactNode;
  onDropTask: (questId: string) => void;
  onRename?: (title: string) => Promise<void>;
  onDelete?: () => void;
  onAdd?: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(title);
  const [over, setOver] = useState(false);

  useEffect(() => {
    setName(title);
  }, [title]);

  return (
    <article
      onDragOver={(event) => {
        event.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        setOver(false);
        const questId = event.dataTransfer.getData("text/quest-id");
        if (questId) onDropTask(questId);
      }}
      className={
        over
          ? "flex w-[260px] shrink-0 flex-col rounded-[28px] border-2 border-[var(--sanctum-gold)] bg-[rgba(10,8,6,0.35)] p-4"
          : "flex w-[260px] shrink-0 flex-col rounded-[28px] border border-[rgba(232,196,140,0.38)] bg-[rgba(10,8,6,0.28)] p-4"
      }
    >
      <div className="mb-4 flex items-center gap-2">
        {editing && onRename ? (
          <form
            className="flex min-w-0 flex-1 items-center gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              const next = name.trim();
              if (!next) return;
              void onRename(next).then(() => setEditing(false));
            }}
          >
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-9 min-w-0 flex-1 rounded-xl border border-[rgba(232,196,140,0.2)] bg-transparent px-2 text-sm outline-none"
              aria-label="Group name"
            />
            <button type="submit" className="text-xs text-[var(--sanctum-gold)]">
              Save
            </button>
          </form>
        ) : (
          <h2 className="min-w-0 flex-1 truncate text-sm text-[var(--sanctum-ink)]">
            {title}
            <span className="ml-2 text-[var(--sanctum-muted)]">{count}</span>
          </h2>
        )}
        {onAdd ? (
          <button
            type="button"
            onClick={onAdd}
            aria-label={`Add a task to ${title}`}
            className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[rgba(228,180,92,0.45)] bg-[rgba(228,180,92,0.16)] text-lg leading-none text-[var(--sanctum-gold)] hover:bg-[rgba(228,180,92,0.28)]"
          >
            +
          </button>
        ) : null}
      </div>
      {canManage ? (
        <div className="mb-3 flex gap-3 text-[11px] text-[var(--sanctum-muted)]">
          <button type="button" onClick={() => setEditing(true)}>
            Rename
          </button>
          <button type="button" className="hover:text-[#f0a07a]" onClick={onDelete}>
            Delete
          </button>
        </div>
      ) : null}
      <div className="grid gap-3">{children}</div>
    </article>
  );
}

function NewNameForm({
  placeholder,
  submitLabel,
  onSubmit,
  compact,
}: {
  placeholder: string;
  submitLabel: string;
  onSubmit: (title: string) => Promise<void>;
  compact?: boolean;
}) {
  const [title, setTitle] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <form
      className={compact ? "flex items-center gap-2" : "mt-3 grid gap-2"}
      onSubmit={(event) => {
        event.preventDefault();
        const next = title.trim();
        if (!next) return;
        startTransition(async () => {
          await onSubmit(next);
          setTitle("");
        });
      }}
    >
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder={placeholder}
        className="h-9 min-w-0 flex-1 rounded-full border border-[rgba(232,196,140,0.2)] bg-transparent px-3 text-sm outline-none placeholder:text-[var(--sanctum-muted)]/70 focus-visible:border-[var(--sanctum-gold)]"
      />
      <button
        type="submit"
        disabled={pending}
        className="text-xs text-[var(--sanctum-gold)] disabled:opacity-50"
      >
        {submitLabel}
      </button>
    </form>
  );
}

function TaskComposerModal({
  listId,
  groupId,
  groupTitle,
  onClose,
}: {
  listId: string;
  groupId: string;
  groupTitle: string;
  onClose: () => void;
}) {
  const titleRef = useRef<HTMLInputElement>(null);
  const [state, action, pending] = useActionState(createQuestAction, { ok: false } satisfies ActionState);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!pending && state.ok) onClose();
  }, [pending, state.ok, onClose]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const dialog = (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-[rgba(8,6,4,0.72)] backdrop-blur-md"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-composer-title"
        className="relative flex max-h-[min(92dvh,760px)] w-full max-w-lg min-w-0 flex-col overflow-hidden rounded-[28px] border border-[rgba(232,196,140,0.28)] bg-[linear-gradient(180deg,rgba(36,26,16,0.98),rgba(16,11,8,0.98))] shadow-[0_30px_80px_rgba(6,4,2,0.55)]"
      >
        <form action={action} className="flex min-h-0 flex-1 flex-col">
        <div className="shrink-0 px-5 pt-5 sm:px-6 sm:pt-6">
          <p className="text-xs tracking-[0.22em] text-[var(--sanctum-gold)] uppercase">New task</p>
          <h2 id="task-composer-title" className="font-splash mt-1 truncate text-2xl text-[var(--sanctum-ink)]">
            {groupTitle}
          </h2>
          <p className="mt-1 text-sm text-[var(--sanctum-muted)]">Fill the details, then save.</p>
        </div>
        <div className="grid min-h-0 flex-1 gap-3 overflow-y-auto px-5 py-4 sm:px-6">
          <input type="hidden" name="list_id" value={listId} />
          <input type="hidden" name="group_id" value={groupId} />
          <label className="grid gap-2 text-xs text-[var(--sanctum-muted)]">
            Title
            <input
              ref={titleRef}
              name="title"
              required
              maxLength={80}
              placeholder="What needs doing?"
              className={modalField}
            />
          </label>
          <label className="grid min-w-0 gap-1.5 text-xs text-[var(--sanctum-muted)]">
            Notes
            <textarea name="description" rows={2} className={`${modalField} h-16 py-2`} />
          </label>
          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
            <label className="grid gap-2 text-xs text-[var(--sanctum-muted)]">
              Priority
              <select name="priority" defaultValue="ash" className={modalField}>
                {QUEST_PRIORITIES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-xs text-[var(--sanctum-muted)]">
              Complete by
              <input type="datetime-local" name="due_at" className={modalField} />
            </label>
            <RepeatFields fieldClass={modalField} />
          </div>
          {state.message ? <p className="text-sm text-[#f0a07a]">{state.message}</p> : null}
        </div>
        <div className="flex shrink-0 justify-end gap-3 border-t border-[rgba(232,196,140,0.12)] px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-5 py-2.5 text-sm text-[var(--sanctum-muted)] hover:text-[var(--sanctum-ink)]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-[var(--sanctum-gold)] px-6 py-2.5 text-sm text-[#1a1208] disabled:opacity-50"
          >
            {pending ? "Saving…" : "Add task"}
          </button>
        </div>
        </form>
      </div>
    </div>
  );

  if (typeof document === "undefined") return dialog;
  return createPortal(dialog, document.body);
}

const modalField =
  "h-11 w-full min-w-0 max-w-full rounded-2xl border border-[rgba(232,196,140,0.18)] bg-[rgba(10,8,6,0.45)] px-3 text-sm text-[var(--sanctum-ink)] outline-none focus-visible:border-[var(--sanctum-gold)]";
