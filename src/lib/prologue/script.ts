export type PrologueSpeaker = "You" | "Aerin";

export type PrologueSceneId =
  | "blackout"
  | "wakeup"
  | "city"
  | "hope"
  | "arrival"
  | "meet"
  | "teach"
  | "restore"
  | "purpose"
  | "spirit"
  | "ending";

export type PrologueLine = {
  text: string;
  speaker?: PrologueSpeaker;
};

export type PrologueScene = {
  id: PrologueSceneId;
  lines: PrologueLine[];
  /** If true, dialogue bar is hidden (e.g. arrival video). */
  hideDialogue?: boolean;
  /** Custom primary button when finishing this scene's last line. */
  nextLabel?: string;
};

export const PROLOGUE_SCENES: PrologueScene[] = [
  {
    id: "blackout",
    lines: [{ text: "Uff... what happened? Why is it so dark?" }],
    nextLabel: "Open your eyes →",
  },
  {
    id: "wakeup",
    lines: [
      { speaker: "You", text: "...Where am I?" },
      { speaker: "You", text: "What... happened?" },
      { speaker: "You", text: "I don't remember anything." },
    ],
  },
  {
    id: "city",
    lines: [
      { speaker: "You", text: "Aurelia..." },
      { speaker: "You", text: "This place was once alive." },
      { speaker: "You", text: "People built. People dreamed. People lived." },
      { speaker: "You", text: "Until everything changed." },
      { speaker: "You", text: "Now... the city is dying." },
    ],
  },
  {
    id: "hope",
    lines: [
      { speaker: "You", text: "But..." },
      { speaker: "You", text: "Something is still alive." },
      { speaker: "You", text: "I can feel it." },
    ],
  },
  {
    id: "arrival",
    lines: [{ text: "A shadow crosses the sky." }],
    hideDialogue: true,
  },
  {
    id: "meet",
    lines: [
      { speaker: "Aerin", text: "You finally awakened." },
      { speaker: "You", text: "Who... are you?" },
      { speaker: "Aerin", text: "I am Aerin." },
      { speaker: "Aerin", text: "And you... are EchoBound." },
      {
        speaker: "Aerin",
        text: "You were chosen to help this world remember what it once was.",
      },
      { speaker: "You", text: "Me? How?" },
      { speaker: "Aerin", text: "Not through magic alone." },
      { speaker: "Aerin", text: "Through what you do every day." },
    ],
  },
  {
    id: "teach",
    lines: [
      { speaker: "Aerin", text: "Every goal you choose becomes a Quest." },
      {
        speaker: "Aerin",
        text: "Study. Work. Train. Create. Whatever you choose to improve...",
      },
      { speaker: "Aerin", text: "...becomes part of your journey." },
      { speaker: "Aerin", text: "Complete your Quests... and earn Experience." },
      { speaker: "Aerin", text: "Grow your Echo... and become stronger." },
      { speaker: "Aerin", text: "Every action shapes you." },
      {
        speaker: "Aerin",
        text: "Learning, training, facing challenges — they forge who you become.",
      },
    ],
  },
  {
    id: "restore",
    lines: [
      {
        speaker: "Aerin",
        text: "But your progress doesn't stop with you.",
      },
      {
        speaker: "Aerin",
        text: "Every Quest you complete helps restore Aurelia.",
      },
      {
        speaker: "Aerin",
        text: "The more you grow... the more this city comes back to life.",
      },
      {
        speaker: "Aerin",
        text: "Along the way you'll find rewards, unlock places, and Cure Keys.",
      },
    ],
  },
  {
    id: "purpose",
    lines: [
      {
        speaker: "Aerin",
        text: "That's your path, EchoBound.",
      },
      {
        speaker: "Aerin",
        text: "You don't need to change the whole world today.",
      },
      { speaker: "Aerin", text: "Just take the next step." },
      { speaker: "Aerin", text: "One Quest. One day. One Echo at a time." },
    ],
  },
  {
    id: "spirit",
    lines: [
      { speaker: "Aerin", text: "But every EchoBound needs a companion." },
      { speaker: "Aerin", text: "A spirit to guide their journey." },
      { speaker: "Aerin", text: "Will you walk with me?" },
    ],
    nextLabel: "Choose Aerin →",
  },
  {
    id: "ending",
    lines: [{ text: "Welcome, EchoBound. Your journey begins." }],
    nextLabel: "Begin Journey →",
  },
];
