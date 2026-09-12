"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { rpgErrorMessage } from "@/modules/rpg/errors";
import { createServerSupabase, rpgBridge } from "@/modules/rpg/supabase/server";
import type {
  CompleteQuestResult,
  RpgActivity,
  RpgAttributeRow,
  RpgGroup,
  RpgInventoryItem,
  RpgLeaderRow,
  RpgList,
  RpgPriority,
  RpgProfile,
  RpgQuest,
  RpgRepeat,
  RpgRepeatUnit,
  RpgSpiritProgress,
  RpgSpiritStory,
  RpgSpiritWhisper,
} from "@/modules/rpg/types";
import { inferQuestShape, judgeSpiritEffort } from "@/modules/rpg/mistral";

export type ActionState = {
  ok: boolean;
  message?: string;
  data?: CompleteQuestResult;
  id?: string;
};

async function requireUser() {
  const { userId } = await auth();
  return {
    supabase: createServerSupabase(),
    userId: userId ?? null,
    secret: rpgBridge(),
  };
}

function refreshBoard() {
  revalidatePath("/board");
  revalidatePath("/vault");
}

function asUuid(value: FormDataEntryValue | string | null | undefined) {
  const next = String(value ?? "").trim();
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(next)
    ? next
    : null;
}

function readQuestFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const listId = asUuid(formData.get("list_id"));
  const groupId = asUuid(formData.get("group_id"));
  const priority = (String(formData.get("priority") ?? "ash") || "ash") as RpgPriority;
  const dueRaw = String(formData.get("due_at") ?? "").trim();
  const parsedDue = dueRaw ? new Date(dueRaw) : null;
  const dueAt = parsedDue && !Number.isNaN(parsedDue.getTime()) ? parsedDue.toISOString() : null;
  const repeatRaw = String(formData.get("repeat") ?? "none");
  const allowed: RpgRepeat[] = ["none", "daily", "weekly", "monthly", "yearly", "custom"];
  const repeat = (allowed.includes(repeatRaw as RpgRepeat) ? repeatRaw : "none") as RpgRepeat;
  const unitRaw = String(formData.get("repeat_unit") ?? "day");
  const units: RpgRepeatUnit[] = ["day", "week", "month", "year"];
  const repeatUnit = (units.includes(unitRaw as RpgRepeatUnit) ? unitRaw : "day") as RpgRepeatUnit;
  const everyRaw = Number.parseInt(String(formData.get("repeat_every") ?? "1"), 10);
  const maxEvery = repeatUnit === "day" ? 365 : repeatUnit === "week" ? 52 : repeatUnit === "month" ? 12 : 1;
  const repeatEvery = Number.isFinite(everyRaw) ? Math.min(maxEvery, Math.max(1, everyRaw)) : 1;
  return {
    title,
    description,
    listId,
    groupId,
    priority,
    dueAt,
    repeat,
    repeatEvery,
    repeatUnit,
  };
}

export async function createQuestAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const fields = readQuestFields(formData);
  if (!fields.title) {
    return { ok: false, message: "Enter a quest name." };
  }

  const { supabase, userId, secret } = await requireUser();
  if (!userId) {
    return { ok: false, message: "Sign in first." };
  }

  const shape = await inferQuestShape(fields.title, fields.description);
  const { error } = await supabase.rpc("rpg_create_quest", {
    p_title: fields.title,
    p_description: fields.description,
    p_category: shape.category,
    p_difficulty: shape.difficulty,
    p_list_id: fields.listId,
    p_group_id: fields.groupId,
    p_priority: fields.priority,
    p_due_at: fields.dueAt,
    p_repeat: fields.repeat,
    p_repeat_every: fields.repeatEvery,
    p_repeat_unit: fields.repeatUnit,
    p_actor: userId,
    p_secret: secret,
  });

  if (error) {
    return { ok: false, message: rpgErrorMessage(error) };
  }

  refreshBoard();
  return { ok: true };
}

export async function updateQuestAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const questId = asUuid(formData.get("quest_id"));
  const fields = readQuestFields(formData);
  if (!questId) {
    return { ok: false, message: "That task is gone. Refresh the board and try again." };
  }
  if (!fields.title) {
    return { ok: false, message: "Enter a quest name." };
  }

  const { supabase, userId, secret } = await requireUser();
  if (!userId) {
    return { ok: false, message: "Sign in first." };
  }

  const shape = await inferQuestShape(fields.title, fields.description);
  const { error } = await supabase.rpc("rpg_update_quest", {
    p_quest_id: questId,
    p_title: fields.title,
    p_description: fields.description,
    p_category: shape.category,
    p_difficulty: shape.difficulty,
    p_list_id: fields.listId,
    p_group_id: fields.groupId,
    p_priority: fields.priority,
    p_due_at: fields.dueAt,
    p_repeat: fields.repeat,
    p_repeat_every: fields.repeatEvery,
    p_repeat_unit: fields.repeatUnit,
    p_actor: userId,
    p_secret: secret,
  });

  if (error) {
    return { ok: false, message: rpgErrorMessage(error) };
  }

  revalidatePath("/board");
  return { ok: true };
}

export async function deleteQuestAction(questId: string): Promise<ActionState> {
  const id = asUuid(questId);
  if (!id) {
    return { ok: false, message: "That task is gone. Refresh the board and try again." };
  }

  const { supabase, userId, secret } = await requireUser();
  if (!userId) {
    return { ok: false, message: "Sign in first." };
  }

  const { error } = await supabase.rpc("rpg_delete_quest", {
    p_quest_id: id,
    p_actor: userId,
    p_secret: secret,
  });

  if (error) {
    return { ok: false, message: rpgErrorMessage(error) };
  }

  revalidatePath("/board");
  return { ok: true };
}

export async function completeQuestAction(questId: string): Promise<ActionState> {
  const id = asUuid(questId);
  if (!id) {
    return { ok: false, message: "That task is gone. Refresh the board and try again." };
  }

  const { supabase, userId, secret } = await requireUser();
  if (!userId) {
    return { ok: false, message: "Sign in first." };
  }

  const { data, error } = await supabase.rpc("rpg_complete_quest", {
    p_quest_id: id,
    p_actor: userId,
    p_secret: secret,
  });

  if (error) {
    return { ok: false, message: rpgErrorMessage(error) };
  }

  const judged = await noticeSpiritEffort(supabase, userId, secret, id);
  refreshBoard();
  return {
    ok: true,
    data: {
      ...(data as CompleteQuestResult),
      whisper: judged.whisper,
      spirit_awards: judged.awards,
      spirit_id: judged.spiritId,
      spirit_points: judged.points,
    },
  };
}

async function noticeSpiritEffort(
  supabase: ReturnType<typeof createServerSupabase>,
  userId: string,
  secret: string,
  questId: string,
) {
  const { data: signals } = await supabase.rpc("rpg_spirit_signals", {
    p_quest_id: questId,
    p_actor: userId,
    p_secret: secret,
  });
  const judgedSignals = (signals ?? {}) as Record<string, unknown>;
  const judgment = await judgeSpiritEffort(judgedSignals);
  const awards = {
    eagle: judgment.eagle,
    deer: judgment.deer,
    wolf: judgment.wolf,
    phoenix: judgment.phoenix,
  };
  const { data } = await supabase.rpc("rpg_award_spirits", {
    p_awards: awards,
    p_speaker: judgment.speaker,
    p_message: judgment.whisper,
    p_quest_title: String(judgedSignals.title ?? "").trim(),
    p_reason: judgment.reason,
    p_points: judgment[judgment.speaker],
    p_actor: userId,
    p_secret: secret,
  });
  const packed = data as { whisper?: RpgSpiritWhisper | null } | null;
  return {
    awards,
    whisper: packed?.whisper ?? {
      id: "live",
      spirit_id: judgment.speaker,
      message: judgment.whisper,
      created_at: new Date().toISOString(),
    },
    spiritId: judgment.speaker,
    points: judgment[judgment.speaker],
  };
}

export async function createListAction(title: string): Promise<ActionState> {
  const { supabase, userId, secret } = await requireUser();
  if (!userId) return { ok: false, message: "Sign in first." };
  const { data, error } = await supabase.rpc("rpg_create_list", {
    p_title: title,
    p_description: "",
    p_actor: userId,
    p_secret: secret,
  });
  if (error) return { ok: false, message: rpgErrorMessage(error) };
  revalidatePath("/board");
  return { ok: true, id: (data as RpgList | null)?.id };
}

export async function renameListAction(listId: string, title: string): Promise<ActionState> {
  const { supabase, userId, secret } = await requireUser();
  if (!userId) return { ok: false, message: "Sign in first." };
  const id = asUuid(listId);
  if (!id) return { ok: false, message: "That list is gone. Refresh the board and try again." };
  const { error } = await supabase.rpc("rpg_rename_list", {
    p_list_id: id,
    p_title: title,
    p_actor: userId,
    p_secret: secret,
  });
  if (error) return { ok: false, message: rpgErrorMessage(error) };
  revalidatePath("/board");
  return { ok: true };
}

export async function deleteListAction(listId: string): Promise<ActionState> {
  const { supabase, userId, secret } = await requireUser();
  if (!userId) return { ok: false, message: "Sign in first." };
  const id = asUuid(listId);
  if (!id) return { ok: false, message: "That list is gone. Refresh the board and try again." };
  const { error } = await supabase.rpc("rpg_delete_list", {
    p_list_id: id,
    p_actor: userId,
    p_secret: secret,
  });
  if (error) return { ok: false, message: rpgErrorMessage(error) };
  revalidatePath("/board");
  return { ok: true };
}

export async function createGroupAction(listId: string, title: string): Promise<ActionState> {
  const { supabase, userId, secret } = await requireUser();
  if (!userId) return { ok: false, message: "Sign in first." };
  const id = asUuid(listId);
  if (!id) return { ok: false, message: "That list is gone. Refresh the board and try again." };
  const { data, error } = await supabase.rpc("rpg_create_group", {
    p_list_id: id,
    p_title: title,
    p_actor: userId,
    p_secret: secret,
  });
  if (error) return { ok: false, message: rpgErrorMessage(error) };
  revalidatePath("/board");
  return { ok: true, id: (data as RpgGroup | null)?.id };
}

export async function moveQuestAction(questId: string, groupId: string | null): Promise<ActionState> {
  const id = asUuid(questId);
  if (!id) {
    return { ok: false, message: "That task is gone. Refresh the board and try again." };
  }

  const { supabase, userId, secret } = await requireUser();
  if (!userId) return { ok: false, message: "Sign in first." };

  const { error } = await supabase.rpc("rpg_move_quest", {
    p_quest_id: id,
    p_group_id: asUuid(groupId),
    p_actor: userId,
    p_secret: secret,
  });
  if (error) return { ok: false, message: rpgErrorMessage(error) };
  revalidatePath("/board");
  return { ok: true };
}

export async function renameGroupAction(groupId: string, title: string): Promise<ActionState> {
  const { supabase, userId, secret } = await requireUser();
  if (!userId) return { ok: false, message: "Sign in first." };
  const id = asUuid(groupId);
  if (!id) return { ok: false, message: "That group is gone. Refresh the board and try again." };
  const { error } = await supabase.rpc("rpg_rename_group", {
    p_group_id: id,
    p_title: title,
    p_actor: userId,
    p_secret: secret,
  });
  if (error) return { ok: false, message: rpgErrorMessage(error) };
  revalidatePath("/board");
  return { ok: true };
}

export async function deleteGroupAction(groupId: string): Promise<ActionState> {
  const { supabase, userId, secret } = await requireUser();
  if (!userId) return { ok: false, message: "Sign in first." };
  const id = asUuid(groupId);
  if (!id) return { ok: false, message: "That group is gone. Refresh the board and try again." };
  const { error } = await supabase.rpc("rpg_delete_group", {
    p_group_id: id,
    p_actor: userId,
    p_secret: secret,
  });
  if (error) return { ok: false, message: rpgErrorMessage(error) };
  revalidatePath("/board");
  return { ok: true };
}

export async function buyItemAction(itemId: string): Promise<ActionState> {
  const { supabase, userId, secret } = await requireUser();
  if (!userId) {
    return { ok: false, message: "Sign in first." };
  }

  const { error } = await supabase.rpc("rpg_buy_item", {
    p_item_id: itemId,
    p_actor: userId,
    p_secret: secret,
  });

  if (error) {
    return { ok: false, message: rpgErrorMessage(error) };
  }

  refreshBoard();
  return { ok: true };
}

export type BoardPayload = {
  profile: RpgProfile;
  attributes: RpgAttributeRow[];
  quests: RpgQuest[];
  lists: RpgList[];
  groups: RpgGroup[];
  inventory: RpgInventoryItem[];
  activity: RpgActivity[];
  spirits: RpgSpiritProgress[];
  stories: RpgSpiritStory[];
  whisper: RpgSpiritWhisper | null;
  leaderboard: RpgLeaderRow[];
};

export async function loadRpgState(): Promise<BoardPayload> {
  const { userId } = await auth();
  if (!userId) {
    redirect("/awaken");
  }

  const traveler = await currentUser();
  const displayName =
    traveler?.fullName ||
    traveler?.username ||
    traveler?.primaryEmailAddress?.emailAddress ||
    "Wanderer";

  const supabase = createServerSupabase();
  const secret = rpgBridge();

  const { error: ensureError } = await supabase.rpc("rpg_ensure_profile", {
    p_display_name: displayName,
    p_actor: userId,
    p_secret: secret,
  });

  if (ensureError) {
    throw new Error(ensureError.message);
  }

  const { data, error } = await supabase.rpc("rpg_load_state", {
    p_actor: userId,
    p_secret: secret,
  });

  if (error || !data) {
    throw new Error(error?.message ?? "Could not load traveler profile.");
  }

  const payload = data as BoardPayload;
  await supabase.rpc("rpg_ensure_spirits", { p_actor: userId, p_secret: secret });
  const { data: spiritPack } = await supabase.rpc("rpg_load_spirits", {
    p_actor: userId,
    p_secret: secret,
  });
  const spirits = (spiritPack as {
    spirits?: RpgSpiritProgress[];
    stories?: RpgSpiritStory[];
    whisper?: RpgSpiritWhisper | null;
  } | null) ?? { spirits: [], stories: [], whisper: null };

  const { data: board } = await supabase.rpc("rpg_leaderboard", {
    p_actor: userId,
    p_secret: secret,
  });

  return {
    profile: payload.profile,
    attributes: payload.attributes ?? [],
    quests: payload.quests ?? [],
    lists: payload.lists ?? [],
    groups: payload.groups ?? [],
    inventory: payload.inventory ?? [],
    activity: payload.activity ?? [],
    spirits: spirits.spirits ?? [],
    stories: spirits.stories ?? [],
    whisper: spirits.whisper ?? null,
    leaderboard: (board as RpgLeaderRow[] | null) ?? [],
  };
}
