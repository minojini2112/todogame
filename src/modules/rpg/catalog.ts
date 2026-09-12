import type { QuestCategory, QuestDifficulty, SpiritForm } from "@/types/game";
import type { RpgPriority, RpgRepeat, RpgRepeatUnit, ShopItem } from "@/modules/rpg/types";

export const DIFFICULTY_PAYOUT: Record<
  QuestDifficulty,
  { xp: number; shards: number }
> = {
  scout: { xp: 20, shards: 8 },
  ranger: { xp: 45, shards: 16 },
  guardian: { xp: 80, shards: 28 },
  legendary: { xp: 140, shards: 48 },
};

export const SHOP_ITEMS: ShopItem[] = [
  {
    item_id: "badge_first_signal",
    name: "First Signal Badge",
    description: "Proof you returned a fragment to Aurelia.",
    price: 40,
  },
  {
    item_id: "theme_aurora",
    name: "Aurora Veil",
    description: "A shimmering overlay for your sanctum.",
    price: 90,
  },
  {
    item_id: "crest_skyform",
    name: "Skyform Crest",
    description: "Wear the mark of the windbound.",
    price: 70,
  },
  {
    item_id: "lantern_heartlight",
    name: "Heartlight Lantern",
    description: "A pocket of city-light for dark days.",
    price: 120,
  },
];

export const SPIRIT_FORMS: { id: SpiritForm; label: string; lore: string }[] = [
  { id: "skyform", label: "Skyform", lore: "Windbound. Clear mind, long view." },
  { id: "wildform", label: "Wildform", lore: "Rooted. Body as the first tool." },
  { id: "deepform", label: "Deepform", lore: "Still water. Recover, then rise." },
  { id: "novaform", label: "Novaform", lore: "Spark-first. Make, then mend." },
];

export const QUEST_CATEGORIES: QuestCategory[] = [
  "focus",
  "endurance",
  "recovery",
  "creation",
  "resolve",
  "connection",
];

export const QUEST_PRIORITIES: {
  id: RpgPriority;
  label: string;
  meaning: string;
}[] = [
  { id: "ember", label: "Urgent", meaning: "Do this first." },
  { id: "gold", label: "High", meaning: "Important soon." },
  { id: "ash", label: "Normal", meaning: "Standard priority." },
  { id: "mist", label: "Low", meaning: "Can wait." },
];

export const QUEST_DIFFICULTIES: QuestDifficulty[] = [
  "scout",
  "ranger",
  "guardian",
  "legendary",
];

export const QUEST_REPEATS: { id: RpgRepeat; label: string; hint: string }[] = [
  { id: "none", label: "Once", hint: "Done after you complete it." },
  { id: "daily", label: "Daily", hint: "Comes back every day." },
  { id: "weekly", label: "Weekly", hint: "Comes back every week." },
  { id: "monthly", label: "Monthly", hint: "Comes back every month." },
  { id: "yearly", label: "Yearly", hint: "Comes back every year." },
  { id: "custom", label: "Custom", hint: "Pick your own interval." },
];

export const QUEST_REPEAT_UNITS: { id: RpgRepeatUnit; label: string; max: number }[] = [
  { id: "day", label: "Days", max: 365 },
  { id: "week", label: "Weeks", max: 52 },
  { id: "month", label: "Months", max: 12 },
  { id: "year", label: "Years", max: 1 },
];

export function repeatEveryMax(unit: RpgRepeatUnit) {
  return QUEST_REPEAT_UNITS.find((item) => item.id === unit)?.max ?? 365;
}
