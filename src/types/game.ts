export type OnboardingStatus =
  | "new"
  | "intro_started"
  | "form_selected"
  | "goal_created"
  | "completed";

export type SpiritForm = "skyform" | "wildform" | "deepform" | "novaform";

export type QuestDifficulty = "scout" | "ranger" | "guardian" | "legendary";

export type QuestStatus = "active" | "completed";

export type QuestCategory =
  | "focus"
  | "endurance"
  | "recovery"
  | "creation"
  | "resolve"
  | "connection";

export type DistrictType =
  | "academy"
  | "power_grid"
  | "healing_gardens"
  | "innovation_lab"
  | "heartlight_core"
  | "community_quarter";

export type AttributeName =
  | "focus"
  | "endurance"
  | "recovery"
  | "creativity"
  | "resolve";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "gold";
export type ButtonSize = "sm" | "md" | "lg";
export type GlowTone = "none" | "cyan" | "gold" | "violet" | "green";
export type BarTone = "cyan" | "gold" | "green" | "violet" | "coral";
