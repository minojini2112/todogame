import type { QuestCategory, QuestDifficulty, SpiritForm } from "@/types/game";

export type RpgQuestStatus = "active" | "completed";

export type RpgProfile = {
  id: string;
  display_name: string;
  spirit_form: SpiritForm;
  level: number;
  xp: number;
  shards: number;
  streak_count: number;
  last_active_on: string | null;
  created_at: string;
  updated_at: string;
};

export type RpgAttributeRow = {
  user_id: string;
  name: "focus" | "endurance" | "recovery" | "creativity" | "resolve";
  value: number;
};

export type RpgPriority = "ember" | "gold" | "ash" | "mist";

export type RpgRepeat = "none" | "daily" | "weekly" | "monthly" | "yearly" | "custom";

export type RpgRepeatUnit = "day" | "week" | "month" | "year";

export type RpgList = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  sort_order: number;
  created_at: string;
};

export type RpgGroup = {
  id: string;
  list_id: string;
  user_id: string;
  title: string;
  sort_order: number;
  created_at: string;
};

export type RpgQuest = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  status: RpgQuestStatus;
  xp_reward: number;
  shard_reward: number;
  list_id: string | null;
  group_id: string | null;
  priority: RpgPriority;
  repeat_rule: RpgRepeat;
  repeat_every: number;
  repeat_unit: RpgRepeatUnit;
  due_at: string | null;
  created_at: string;
  completed_at: string | null;
  updated_at: string;
};

export type RpgInventoryItem = {
  id: string;
  user_id: string;
  item_id: string;
  purchased_at: string;
};

export type RpgActivity = {
  id: string;
  user_id: string;
  kind: string;
  payload: Record<string, unknown>;
  created_at: string;
};

export type RpgSpiritId = "eagle" | "deer" | "wolf" | "phoenix";

export type RpgSpiritProgress = {
  spirit_id: RpgSpiritId;
  points: number;
};

export type RpgSpiritWhisper = {
  id: string;
  spirit_id: RpgSpiritId;
  message: string;
  created_at: string;
};

export type RpgSpiritStory = {
  id: string;
  spirit_id: RpgSpiritId;
  message: string;
  quest_title: string;
  reason: string;
  points: number;
  created_at: string;
};

export type CompleteQuestResult = {
  quest_id: string;
  title: string;
  xp: number;
  shards: number;
  attribute: string;
  level: number;
  xp_into_level: number;
  leveled_up: boolean;
  streak: number;
  whisper?: RpgSpiritWhisper | null;
  spirit_awards?: Partial<Record<RpgSpiritId, number>>;
  spirit_id?: RpgSpiritId;
  spirit_points?: number;
};

export type ShopItem = {
  item_id: string;
  name: string;
  description: string;
  price: number;
};
