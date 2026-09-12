export type TowerId =
  | "dawn_hall"
  | "river_bridge"
  | "colonnade"
  | "heartlight_ring";

export type TowerStatus = "restored" | "active" | "damaged" | "locked";

export interface TowerNode {
  id: TowerId;
  spiritId: "eagle" | "deer" | "wolf" | "phoenix";
  name: string;
  subtitle: string;
  x: number;
  y: number;
  status: TowerStatus;
  level: number;
  connections: TowerId[];
  district: string;
  image: string;
  containImage?: boolean;
  cardSide: "left" | "right";
}

/**
 * The map markers are the four spirits, not numbered city levels.
 */
export const TOWERS: TowerNode[] = [
  {
    id: "dawn_hall",
    spiritId: "eagle",
    name: "Aerin",
    subtitle: "Focus",
    x: 24,
    y: 72,
    status: "active",
    level: 1,
    connections: ["river_bridge"],
    district: "Deep, undivided work.",
    image: "/assets/prologue/spirit/spirit_flyingfront.png",
    containImage: true,
    cardSide: "left",
  },
  {
    id: "river_bridge",
    spiritId: "wolf",
    name: "Lupen",
    subtitle: "Swiftness",
    x: 78,
    y: 70,
    status: "active",
    level: 2,
    connections: ["dawn_hall", "colonnade"],
    district: "Finishing before the hour closes.",
    image: "/assets/Lupen.png",
    containImage: true,
    cardSide: "left",
  },
  {
    id: "colonnade",
    spiritId: "deer",
    name: "Sylva",
    subtitle: "Gentleness",
    x: 24,
    y: 34,
    status: "active",
    level: 3,
    connections: ["river_bridge", "heartlight_ring"],
    district: "Care, rest, and quiet kindness.",
    image: "/assets/Sylva.png",
    containImage: true,
    cardSide: "right",
  },
  {
    id: "heartlight_ring",
    spiritId: "phoenix",
    name: "Pyra",
    subtitle: "Rise",
    x: 78,
    y: 32,
    status: "active",
    level: 4,
    connections: ["colonnade"],
    district: "Trying again until it is done.",
    image: "/assets/Pyra.png",
    containImage: true,
    cardSide: "right",
  },
];

export const TOWER_MAP = Object.fromEntries(
  TOWERS.map((tower) => [tower.id, tower]),
) as Record<TowerId, TowerNode>;

export function areConnected(a: TowerId, b: TowerId): boolean {
  return TOWER_MAP[a].connections.includes(b);
}

export function getTravelPath(from: TowerId, to: TowerId): TowerId[] | null {
  if (from === to) return [from];
  if (areConnected(from, to)) return [from, to];

  const queue: TowerId[][] = [[from]];
  const seen = new Set<TowerId>([from]);

  while (queue.length) {
    const path = queue.shift()!;
    const current = path[path.length - 1];
    for (const next of TOWER_MAP[current].connections) {
      if (seen.has(next)) continue;
      const nextPath = [...path, next];
      if (next === to) return nextPath;
      seen.add(next);
      queue.push(nextPath);
    }
  }

  return null;
}
