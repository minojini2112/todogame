import type { RpgSpiritId, RpgSpiritProgress, RpgSpiritStory } from "@/modules/rpg/types";

export const SPIRIT_UNLOCK = 60;

export const SPIRITS: {
  id: RpgSpiritId;
  name: string;
  trait: string;
  watches: string;
  image: string;
}[] = [
  {
    id: "eagle",
    name: "Aerin",
    trait: "Focus",
    watches: "Deep, undivided work. Choosing one thing and staying with it.",
    image: "/assets/prologue/spirit/spirit_flyingfront.png",
  },
  {
    id: "deer",
    name: "Sylva",
    trait: "Gentleness",
    watches: "Care, rest, patience, and kindness to the body and to others.",
    image: "/assets/Sylva.png",
  },
  {
    id: "wolf",
    name: "Lupen",
    trait: "Swiftness",
    watches: "Finishing before the due time, especially when the task was urgent.",
    image: "/assets/Lupen.png",
  },
  {
    id: "phoenix",
    name: "Pyra",
    trait: "Rise",
    watches: "Trying again after a miss, late finishes that still happen, habits kept.",
    image: "/assets/Pyra.png",
  },
];

export function spiritById(id: RpgSpiritId) {
  return SPIRITS.find((spirit) => spirit.id === id) ?? SPIRITS[0];
}

export function spiritFill(points: number) {
  return Math.min(1, points / SPIRIT_UNLOCK);
}

export function mergeSpiritRows(
  rows: RpgSpiritProgress[] | undefined,
  stories: RpgSpiritStory[] | undefined = [],
) {
  return SPIRITS.map((spirit) => ({
    ...spirit,
    points: rows?.find((row) => row.spirit_id === spirit.id)?.points ?? 0,
    stories: (stories ?? []).filter((story) => story.spirit_id === spirit.id),
  }));
}

/** Companion with the highest spirit points (ties → first in catalog order). */
export function leadingCompanion(
  rows: RpgSpiritProgress[] | undefined,
  stories: RpgSpiritStory[] | undefined = [],
) {
  const merged = mergeSpiritRows(rows, stories);
  return merged.reduce((best, spirit) => (spirit.points > best.points ? spirit : best));
}
