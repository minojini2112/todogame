import { QUEST_REPEATS, QUEST_REPEAT_UNITS } from "@/modules/rpg/catalog";
import type { RpgQuest } from "@/modules/rpg/types";

export function formatRepeat(quest: Pick<RpgQuest, "repeat_rule" | "repeat_every" | "repeat_unit">) {
  const rule = quest.repeat_rule ?? "none";
  if (rule === "none") return null;
  if (rule === "custom") {
    const count = quest.repeat_every ?? 1;
    const unit =
      QUEST_REPEAT_UNITS.find((item) => item.id === quest.repeat_unit)?.label.toLowerCase() ?? "days";
    const singular = unit.replace(/s$/, "");
    return `Every ${count} ${count === 1 ? singular : unit}`;
  }
  return QUEST_REPEATS.find((item) => item.id === rule)?.label ?? rule;
}

export function formatRepeatDone(quest: Pick<RpgQuest, "repeat_rule" | "repeat_every" | "repeat_unit">) {
  const label = formatRepeat(quest);
  if (!label) return null;
  return `Done for now. Returns ${label.toLowerCase()}.`;
}

export function formatBound(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatDue(iso: string | null) {
  if (!iso) return "No due date";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "No due date";
  const now = Date.now();
  const diff = date.getTime() - now;
  const day = 86_400_000;
  if (diff < 0) return `Overdue · ${formatBound(iso)}`;
  if (diff < day) return `Due today · ${formatBound(iso)}`;
  if (diff < day * 2) return `Due tomorrow`;
  return `Due ${formatBound(iso)}`;
}

export function toLocalInput(iso: string | null) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function fromLocalInput(value: string) {
  if (!value.trim()) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}
