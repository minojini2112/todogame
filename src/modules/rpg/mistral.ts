import type { QuestCategory, QuestDifficulty } from "@/types/game";

export type InferredQuestShape = {
  category: QuestCategory;
  difficulty: QuestDifficulty;
};

export type SpiritJudgment = {
  eagle: number;
  deer: number;
  wolf: number;
  phoenix: number;
  speaker: "eagle" | "deer" | "wolf" | "phoenix";
  whisper: string;
  reason: string;
};

const EMPTY: SpiritJudgment = {
  eagle: 0,
  deer: 0,
  wolf: 0,
  phoenix: 0,
  speaker: "deer",
  whisper: "",
  reason: "",
};

const CATEGORIES: QuestCategory[] = [
  "focus",
  "endurance",
  "recovery",
  "creation",
  "resolve",
  "connection",
];
const DIFFICULTIES: QuestDifficulty[] = ["scout", "ranger", "guardian", "legendary"];

export async function inferQuestShape(title: string, notes: string): Promise<InferredQuestShape> {
  const fallback = fallbackShape(title, notes);
  const key = process.env.MISTRAL_API_KEY;
  if (!key) return fallback;

  const system = `You classify a real-life task. The user must NOT choose path or weight.
Pick honestly. Do not inflate difficulty for ordinary chores.
category: focus | endurance | recovery | creation | resolve | connection
difficulty: scout (tiny) | ranger (normal) | guardian (hard) | legendary (rare, truly heavy)
Reply JSON only: {"category":"focus","difficulty":"ranger"}`;

  try {
    const raw = await askMistral(system, JSON.stringify({ title, notes }), 0.1);
    const parsed = JSON.parse(raw) as Partial<InferredQuestShape>;
    return {
      category: CATEGORIES.includes(parsed.category as QuestCategory)
        ? (parsed.category as QuestCategory)
        : fallback.category,
      difficulty: DIFFICULTIES.includes(parsed.difficulty as QuestDifficulty)
        ? (parsed.difficulty as QuestDifficulty)
        : fallback.difficulty,
    };
  } catch {
    return fallback;
  }
}

function fallbackShape(title: string, notes: string): InferredQuestShape {
  const text = `${title} ${notes}`.toLowerCase();
  let category: QuestCategory = "focus";
  if (/(walk|run|gym|workout|exercise)/.test(text)) category = "endurance";
  else if (/(eat|food|meal|healthy|sleep|rest|meditat|recover)/.test(text)) category = "recovery";
  else if (/(draw|write|build|make|cook)/.test(text)) category = "creation";
  else if (/(call|friend|family|listen)/.test(text)) category = "connection";
  else if (/(hard|fix|stand|finish)/.test(text)) category = "resolve";

  let difficulty: QuestDifficulty = "ranger";
  if (/(tiny|quick|5 min|minutes)/.test(text)) difficulty = "scout";
  if (/(all day|project|thesis|marathon)/.test(text)) difficulty = "guardian";
  return { category, difficulty };
}

async function askMistral(system: string, user: string, temperature: number) {
  const key = process.env.MISTRAL_API_KEY;
  if (!key) throw new Error("missing key");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 9000);
  try {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        temperature,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error("mistral failed");
    const body = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    return body.choices?.[0]?.message?.content ?? "{}";
  } finally {
    clearTimeout(timer);
  }
}

export async function judgeSpiritEffort(signals: Record<string, unknown>): Promise<SpiritJudgment> {
  const key = process.env.MISTRAL_API_KEY;
  if (!key) return fallbackJudgment(signals);

  const system = `You are one of four spirits watching a real person live their day. Choose EXACTLY ONE spirit. Only that spirit scores. Only that spirit speaks.
The user cannot pick the spirit or the points. Ignore farming and empty title-only praise.
Pick the best match for HOW they showed up, not the task name:
- eagle: deep focus, concentration, single-minded work
- deer: care, rest, gentleness, patience, kindness
- wolf: finished BEFORE a fair due time (early_hours under 48). If not truly early, do not pick wolf.
- phoenix: trying again, returning after a miss, keeping a habit, or finishing late anyway
points: 1 to 4 only, honest, not inflated.
whisper: two short sentences, second person, spoken ONLY as that spirit, no hashtags.
reason: 3 to 5 sentences. This is the NOTICE, not a task label. Write as the spirit who saw them. Say you noticed them. Name the human quality: coming back again and again until it was done, staying consistent, finishing late and still doing it, sitting with one thing, being gentle with a body or another person. Use the hints. The task title may appear once in passing. Never make the title the reason. Warm, specific, no hashtags.
Reply JSON only: {"spirit":"wolf","points":2,"whisper":"...","reason":"..."}`;

  try {
    const raw = await askMistral(system, JSON.stringify(packSignals(signals)), 0.5);
    const parsed = JSON.parse(raw) as { spirit?: string; points?: number; whisper?: string; reason?: string };
    return focusOne(parsed.spirit, parsed.points, parsed.whisper, parsed.reason, signals);
  } catch {
    return fallbackJudgment(signals);
  }
}

function clamp(value: unknown) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(5, Math.round(n)));
}

function focusOne(
  spiritRaw: unknown,
  pointsRaw: unknown,
  whisperRaw: unknown,
  reasonRaw: unknown,
  signals: Record<string, unknown>,
): SpiritJudgment {
  const earlyOk = Boolean(signals.before_due) && Number(signals.early_hours ?? 0) <= 48;
  let speaker: SpiritJudgment["speaker"] =
    spiritRaw === "eagle" || spiritRaw === "deer" || spiritRaw === "wolf" || spiritRaw === "phoenix"
      ? spiritRaw
      : pickSpirit(signals);
  if (speaker === "wolf" && !earlyOk) speaker = pickSpirit({ ...signals, before_due: false });

  const next = { ...EMPTY, speaker };
  next[speaker] = Math.max(1, Math.min(4, clamp(pointsRaw) || 2));
  next.whisper = String(whisperRaw ?? "").trim().slice(0, 280) || lineFor(speaker);
  const written = String(reasonRaw ?? "").trim().slice(0, 520);
  next.reason = isHumanNotice(written, signals) ? written : reasonFromSignals(speaker, signals);
  return next;
}

function packSignals(signals: Record<string, unknown>) {
  const tries = Number(signals.same_title_tries ?? 0);
  const habit = Number(signals.habit_completions ?? 0);
  const early = Number(signals.early_hours ?? 0);
  const late = Number(signals.late_hours ?? 0);
  const hints: string[] = [];
  if (tries > 1) hints.push(`They returned to this same work ${tries} times until it was done.`);
  if (habit >= 2) hints.push(`They have completed this work ${habit} times. That is consistency.`);
  if (signals.before_due && early > 0 && early <= 48) {
    hints.push(`They finished ${early} hours before the due time.`);
  }
  if (signals.after_due) hints.push(`They finished ${late} hours late, and still finished.`);
  if (String(signals.repeat_rule ?? "none") !== "none") {
    hints.push("This is repeating work they chose to keep.");
  }
  if (hints.length === 0) hints.push("Notice the human quality in how they did this, not the title.");
  return { ...signals, noticed: hints };
}

function isHumanNotice(reason: string, signals: Record<string, unknown>) {
  const title = String(signals.title ?? "").trim().toLowerCase();
  const compact = reason.toLowerCase().replace(/[“”"'.]/g, "").trim();
  if (reason.length < 60) return false;
  if (title && (compact === title || compact.startsWith(`finished ${title}`) || compact === `for ${title}`)) {
    return false;
  }
  return true;
}

export function reasonFromSignals(
  speaker: SpiritJudgment["speaker"],
  signals: Record<string, unknown>,
) {
  const tries = Number(signals.same_title_tries ?? 0);
  const habit = Number(signals.habit_completions ?? 0);
  if (speaker === "phoenix") {
    if (tries > 1) {
      return "I noticed you did not leave this after the first miss. You came back again, and again, until it was actually done. That stubborn return is a human thing. The world forgets second tries. I do not.";
    }
    if (habit >= 2 || String(signals.repeat_rule ?? "none") !== "none") {
      return "I noticed you kept showing up for the same work. Not a burst. A rhythm. Consistency is quiet, and it is how a life is built.";
    }
    if (signals.after_due) {
      return "I noticed you were late and you still finished. You did not hide from the undone thing. That is rising, not perfection.";
    }
    return "I noticed you stood up for this when it would have been easier to let it slip. Finishing after a wobble still counts.";
  }
  if (speaker === "wolf") {
    return "I noticed you arrived before the hour closed. You did not wait for the last minute to decide you cared. Swiftness with intention is still a kind of honor.";
  }
  if (speaker === "eagle") {
    return "I noticed you stayed with one thing. No scatter. You gave this your mind instead of splitting yourself across a dozen unfinished starts.";
  }
  return "I noticed the quiet care in this. You were gentle with a body, a person, or a tired day. Not every kindness is loud, and I still marked it.";
}

function pickSpirit(signals: Record<string, unknown>): SpiritJudgment["speaker"] {
  const category = String(signals.category ?? "");
  const habit = Number(signals.habit_completions ?? 0);
  const tries = Number(signals.same_title_tries ?? 0);
  const early = Number(signals.early_hours ?? 0);
  if (signals.before_due && early > 0 && early <= 48) return "wolf";
  if (signals.after_due || tries > 1 || (String(signals.repeat_rule ?? "none") !== "none" && habit >= 2)) {
    return "phoenix";
  }
  if (category === "recovery" || category === "connection") return "deer";
  if (category === "endurance") return "phoenix";
  if (category === "focus" || category === "creation") return "eagle";
  return "deer";
}

function lineFor(speaker: SpiritJudgment["speaker"]) {
  if (speaker === "wolf") return "The Wolf saw you arrive before the hour closed. Speed with care is still a kind of honor.";
  if (speaker === "phoenix") return "The Phoenix saw you stand up again. The world forgets second tries. We do not.";
  if (speaker === "eagle") return "The Eagle marked the still point in your mind. One path. No scatter.";
  return "The Deer noticed the quiet care in this. Not every kindness is loud.";
}

function fallbackJudgment(signals: Record<string, unknown>): SpiritJudgment {
  const speaker = pickSpirit(signals);
  const habit = Number(signals.habit_completions ?? 0);
  const tries = Number(signals.same_title_tries ?? 0);
  const early = Number(signals.early_hours ?? 0);
  let points = 2;
  if (speaker === "wolf" && early >= 6) points = 3;
  if (speaker === "phoenix" && tries > 1) points = 3;
  if (habit >= 4) points = Math.min(4, points + 1);
  return focusOne(speaker, points, lineFor(speaker), reasonFromSignals(speaker, signals), signals);
}
