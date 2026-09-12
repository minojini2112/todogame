import type { DistrictType, QuestCategory, QuestDifficulty } from "@/types/game";

export const XP_REWARDS: Record<QuestDifficulty, number> = {
  scout: 20,
  ranger: 45,
  guardian: 80,
  legendary: 140,
};

export const DIFFICULTY_LABELS: Record<QuestDifficulty, string> = {
  scout: "Scout Quest",
  ranger: "Ranger Quest",
  guardian: "Guardian Quest",
  legendary: "Legendary Quest",
};

export const CATEGORY_LABELS: Record<QuestCategory, string> = {
  focus: "Focus",
  endurance: "Endurance",
  recovery: "Recovery",
  creation: "Creation",
  resolve: "Resolve",
  connection: "Connection",
};

export const DISTRICT_LABELS: Record<DistrictType, string> = {
  academy: "Academy",
  power_grid: "Power Grid",
  healing_gardens: "Healing Gardens",
  innovation_lab: "Innovation Lab",
  heartlight_core: "Heartlight Core",
  community_quarter: "Community Quarter",
};

export const CATEGORY_TO_DISTRICT: Record<QuestCategory, DistrictType> = {
  focus: "academy",
  endurance: "power_grid",
  recovery: "healing_gardens",
  creation: "innovation_lab",
  resolve: "heartlight_core",
  connection: "community_quarter",
};

export const ATTRIBUTE_LABELS = {
  focus: "Focus",
  endurance: "Endurance",
  recovery: "Recovery",
  creativity: "Creativity",
  resolve: "Resolve",
} as const;
