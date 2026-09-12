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
    name: "Eagle",
    trait: "Focus",
    watches: "Deep, undivided work. Choosing one thing and staying with it.",
    image: "/assests/spirit_eagle.png",
  },
  {
    id: "deer",
    name: "Deer",
    trait: "Gentleness",
    watches: "Care, rest, patience, and kindness to the body and to others.",
    image: "/assests/spirit_deer.jpg",
  },
  {
    id: "wolf",
    name: "Wolf",
    trait: "Swiftness",
    watches: "Finishing before the due time, especially when the task was urgent.",
    image: "/assests/spirit_wolf.jpg",
  },
  {
    id: "phoenix",
    name: "Phoenix",
    trait: "Rise",
    watches: "Trying again after a miss, late finishes that still happen, habits kept.",
    image: "/assests/spirit_phoenix.jpg",
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
