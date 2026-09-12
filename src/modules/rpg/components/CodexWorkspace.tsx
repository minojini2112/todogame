"use client";

import {
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
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
import { useReducedMotion } from "@/hooks/useReducedMotion";
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

export function CodexWorkspace({ lists, groups, quests }: CodexWorkspaceProps) {
  const reduced = useReducedMotion();
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
        setError(result.message ?? "Could not complete this quest.");
        return;
      }
      if (result.data) setReward(result.data);
      if (result.data?.whisper) setLiveWhisper(result.data.whisper);
    });
  }

  return (
    <motion.div
      data-tour="tour-workspace"
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0.15 : 0.55, ease: "easeOut" }}
      className="sanctum-panel sanctum-panel-glow w-full rounded-[32px] border border-[rgba(232,196,140,0.28)] p-4 sm:p-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-display text-[10px] tracking-[0.32em] text-[var(--sanctum-gold)] uppercase">
            Quest log
          </p>
          <h1 className="font-splash mt-1 text-2xl text-[var(--sanctum-ink)] sm:text-3xl">
            Your paths
          </h1>
          <p className="mt-1 max-w-md text-sm text-[var(--sanctum-muted)]">
            Each path is a list. Add groups as columns, then put quests inside them.
          </p>
        </div>
        <div
          data-tour="tour-filter"
          className="flex rounded-full border border-[rgba(232,196,140,0.22)] bg-black/25 p-1 backdrop-blur-md"
          role="group"
          aria-label="Quest status"
        >
          <FilterChip active={!showDone} onClick={() => setShowDone(false)}>
            Open
          </FilterChip>
          <FilterChip active={showDone} onClick={() => setShowDone(true)}>
            Completed
          </FilterChip>
        </div>
      </div>

      <div
        data-tour="tour-lists"
        className="mt-5 flex flex-wrap items-center gap-2"
        role="tablist"
        aria-label="Paths"
      >
        <ListTab label="Inbox" active={!activeList} onClick={() => setListId(null)} />
        {lists.map((list) => (
          <ListTab
            key={list.id}
            label={list.title}
            active={list.id === activeList?.id}
            onClick={() => setListId(list.id)}
          />
        ))}
        <div data-tour="tour-new-list">
          <NewNameForm
            compact
            placeholder="Name a new path…"
            submitLabel="Create"
            onSubmit={async (title) => {
              const result = await createListAction(title);
              if (!result.ok) {
                setError(result.message ?? "Could not create path.");
                return;
              }
              if (result.id) setListId(result.id);
            }}
          />
        </div>
        {activeList ? (
          <button
            type="button"
            className="px-2 font-display text-[10px] tracking-[0.16em] text-[var(--sanctum-muted)] uppercase transition hover:text-[#f0a07a]"
            onClick={() =>
              run(async () => {
                const result = await deleteListAction(activeList.id);
                if (result.ok) setListId(null);
                return result;
              }, "Could not delete path.")
            }
          >
            Delete path
          </button>
        ) : null}
      </div>

      <div aria-live="polite" className="min-h-5">
        {error ? <p className="pt-3 text-sm text-[#f0a07a]">{error}</p> : null}
      </div>

      <div className="mt-5 flex gap-5 overflow-x-auto pb-3">
        {!activeList && !showDone && columns.length === 0 ? (
          <motion.button
            type="button"
            whileHover={reduced ? undefined : { scale: 1.06 }}
            whileTap={reduced ? undefined : { scale: 0.96 }}
            onClick={() => setComposer({ listId: "", groupId: "", groupTitle: "Inbox" })}
            className="sanctum-add-orb flex size-10 items-center justify-center rounded-full border border-[rgba(228,180,92,0.45)] bg-[rgba(228,180,92,0.16)] text-xl leading-none text-[var(--sanctum-gold)]"
            aria-label="Add an inbox quest"
            data-tour="tour-add-task"
          >
            +
          </motion.button>
        ) : null}
        <AnimatePresence mode="popLayout">
          {columns.map((column, index) => (
            <motion.div
              key={column.id ?? "ungrouped"}
              layout={!reduced}
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, scale: 0.96 }}
              transition={{ delay: reduced ? 0 : index * 0.05, duration: 0.35 }}
            >
              <GroupColumn
                title={column.title}
                count={column.quests.length}
                canManage={column.canManage}
                onDropTask={(questId) =>
                  run(() => moveQuestAction(questId, column.id), "Could not move this quest.")
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
                    ? () =>
                        run(() => deleteGroupAction(column.id as string), "Could not delete group.")
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
                    onDelete={() =>
                      run(() => deleteQuestAction(quest.id), "Could not delete this quest.")
                    }
                  />
                ))}
              </GroupColumn>
            </motion.div>
          ))}
        </AnimatePresence>

        {activeList && !showDone ? (
          <motion.article
            data-tour="tour-new-group"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex w-[260px] shrink-0 flex-col rounded-[28px] border border-dashed border-[rgba(232,196,140,0.35)] bg-[rgba(10,8,6,0.18)] p-4"
          >
            <p className="text-center font-display text-[10px] tracking-[0.24em] text-[var(--sanctum-gold)] uppercase">
              New group
            </p>
            <p className="mt-2 text-center text-xs text-[var(--sanctum-muted)]">
              Adds a column on this path for related quests.
            </p>
            <NewNameForm
              placeholder="Group name…"
              submitLabel="Add group"
              onSubmit={async (title) => {
                const result = await createGroupAction(activeList.id, title);
                if (!result.ok) setError(result.message ?? "Could not create group.");
              }}
            />
          </motion.article>
        ) : (
          <div data-tour="tour-new-group" className="sr-only" aria-hidden />
        )}
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
        title={reward?.title ?? "Quest complete"}
        spiritId={reward?.spirit_id ?? null}
        points={reward?.spirit_points ?? 0}
        onClose={() => setReward(null)}
      />
      <LevelBurst
        open={Boolean(reward?.leveled_up)}
        level={reward?.level ?? 1}
        onClose={() => setReward(null)}
      />
    </motion.div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "rounded-full bg-[var(--sanctum-gold)] px-4 py-1.5 font-display text-[10px] tracking-[0.16em] text-[#1a1208] uppercase"
          : "rounded-full px-4 py-1.5 font-display text-[10px] tracking-[0.16em] text-[var(--sanctum-muted)] uppercase transition hover:text-[var(--sanctum-ink)]"
      }
    >
      {children}
    </button>
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
          ? "sanctum-tab-active rounded-full border border-[rgba(228,180,92,0.55)] bg-[rgba(228,180,92,0.18)] px-4 py-2 text-sm shadow-[0_0_18px_rgba(228,180,92,0.18)] transition duration-300"
          : "rounded-full border border-[rgba(232,196,140,0.2)] px-4 py-2 text-sm text-[var(--sanctum-muted)] transition duration-300 hover:-translate-y-0.5 hover:border-[rgba(232,196,140,0.45)] hover:text-[var(--sanctum-ink)]"
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
  children: ReactNode;
  onDropTask: (questId: string) => void;
  onRename?: (title: string) => Promise<void>;
  onDelete?: () => void;
  onAdd?: () => void;
}) {
  const reduced = useReducedMotion();
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
          ? "sanctum-column flex w-[270px] shrink-0 flex-col rounded-[28px] border-2 border-[var(--sanctum-gold)] bg-[rgba(10,8,6,0.4)] p-4 shadow-[0_0_30px_rgba(228,180,92,0.2)] transition duration-300"
          : "sanctum-column flex w-[270px] shrink-0 flex-col rounded-[28px] border border-[rgba(232,196,140,0.38)] bg-[rgba(10,8,6,0.3)] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-[rgba(232,196,140,0.55)] hover:shadow-[0_12px_30px_rgba(6,4,2,0.35)]"
      }
    >
      <div className="mb-3 flex items-center gap-2">
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
              aria-label="Pillar name"
            />
            <button type="submit" className="text-xs text-[var(--sanctum-gold)]">
              Save
            </button>
          </form>
        ) : (
          <h2 className="min-w-0 flex-1 truncate font-splash text-base text-[var(--sanctum-ink)]">
            {title}
            <span className="ml-2 font-sans text-xs text-[var(--sanctum-muted)]">{count}</span>
          </h2>
        )}
        {onAdd ? (
          <motion.button
            type="button"
            data-tour="tour-add-task"
            whileHover={reduced ? undefined : { scale: 1.08, rotate: 90 }}
            whileTap={reduced ? undefined : { scale: 0.92 }}
            onClick={onAdd}
            aria-label={`Add a quest to ${title}`}
            className="sanctum-add-orb flex size-8 shrink-0 items-center justify-center rounded-full border border-[rgba(228,180,92,0.45)] bg-[rgba(228,180,92,0.16)] text-lg leading-none text-[var(--sanctum-gold)]"
          >
            +
          </motion.button>
        ) : null}
      </div>
      {canManage ? (
        <div className="mb-3 flex gap-3 font-display text-[10px] tracking-[0.14em] text-[var(--sanctum-muted)] uppercase">
          <button type="button" className="transition hover:text-[var(--sanctum-ink)]" onClick={() => setEditing(true)}>
            Rename
          </button>
          <button type="button" className="transition hover:text-[#f0a07a]" onClick={onDelete}>
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
        className="font-display text-[10px] tracking-[0.16em] text-[var(--sanctum-gold)] uppercase disabled:opacity-50"
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
  const reduced = useReducedMotion();
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
      <motion.button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-[rgba(8,6,4,0.72)] backdrop-blur-md"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-composer-title"
        initial={reduced ? false : { opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className="relative flex max-h-[min(92dvh,760px)] w-full max-w-lg min-w-0 flex-col overflow-hidden rounded-[28px] border border-[rgba(232,196,140,0.28)] bg-[linear-gradient(180deg,rgba(36,26,16,0.98),rgba(16,11,8,0.98))] shadow-[0_30px_80px_rgba(6,4,2,0.55),0_0_40px_rgba(228,180,92,0.12)]"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(ellipse_at_top,rgba(228,180,92,0.18),transparent_70%)]" />
        <form action={action} className="relative flex min-h-0 flex-1 flex-col">
          <div className="shrink-0 px-5 pt-5 sm:px-6 sm:pt-6">
            <p className="font-display text-[10px] tracking-[0.28em] text-[var(--sanctum-gold)] uppercase">
              New quest
            </p>
            <h2 id="task-composer-title" className="font-splash mt-1 truncate text-2xl text-[var(--sanctum-ink)]">
              {groupTitle}
            </h2>
            <p className="mt-1 text-sm text-[var(--sanctum-muted)]">
              Name what you’ll do, then save it to this group.
            </p>
          </div>
          <div className="grid min-h-0 flex-1 gap-3 overflow-y-auto px-5 py-4 sm:px-6">
            <input type="hidden" name="list_id" value={listId} />
            <input type="hidden" name="group_id" value={groupId} />
            <label className="grid gap-2 text-xs text-[var(--sanctum-muted)]">
              Quest name
              <input
                ref={titleRef}
                name="title"
                required
                maxLength={80}
                placeholder="What will you take on?"
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
                Due date
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
              className="rounded-full border border-[rgba(228,180,92,0.7)] bg-[rgba(228,180,92,0.2)] px-6 py-2.5 font-display text-xs tracking-[0.16em] text-white uppercase shadow-[0_0_24px_rgba(228,180,92,0.35)] transition hover:bg-[rgba(228,180,92,0.35)] disabled:opacity-50"
            >
              {pending ? "Saving…" : "Add quest"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );

  if (typeof document === "undefined") return dialog;
  return createPortal(dialog, document.body);
}

const modalField =
  "h-11 w-full min-w-0 max-w-full rounded-2xl border border-[rgba(232,196,140,0.18)] bg-[rgba(10,8,6,0.45)] px-3 text-sm text-[var(--sanctum-ink)] outline-none transition focus-visible:border-[var(--sanctum-gold)] focus-visible:shadow-[0_0_0_3px_rgba(228,180,92,0.15)]";
