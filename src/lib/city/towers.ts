export type TowerId =
  | "heartlight"
  | "academy"
  | "power_grid"
  | "healing_gardens"
  | "archive_gate"
  | "innovation_lab"
  | "community_quarter";

export type TowerStatus = "restored" | "active" | "damaged" | "locked";

export interface TowerNode {
  id: TowerId;
  name: string;
  subtitle: string;
  /** Position on map image, percent (0–100) */
  x: number;
  y: number;
  status: TowerStatus;
  level: number;
  connections: TowerId[];
  district: string;
}

/**
 * Hotspots aligned to landmarks on the Aurelia city plate.
 * Coordinates are % of the map image so they scale with zoom.
 */
export const TOWERS: TowerNode[] = [
  {
    id: "heartlight",
    name: "Heartlight Spire",
    subtitle: "Command nexus",
    x: 50.2,
    y: 46.8,
    status: "active",
    level: 1,
    connections: ["academy", "power_grid", "healing_gardens", "community_quarter"],
    district: "Heartlight Core",
  },
  {
    id: "academy",
    name: "Academy Tower",
    subtitle: "Focus & study",
    x: 41.5,
    y: 41.2,
    status: "damaged",
    level: 2,
    connections: ["heartlight", "archive_gate", "community_quarter"],
    district: "Academy District",
  },
  {
    id: "power_grid",
    name: "Grid Pylon",
    subtitle: "Endurance & energy",
    x: 59.8,
    y: 43.5,
    status: "damaged",
    level: 2,
    connections: ["heartlight", "innovation_lab", "community_quarter"],
    district: "Power Grid",
  },
  {
    id: "healing_gardens",
    name: "Garden Sanctum",
    subtitle: "Recovery rituals",
    x: 47.8,
    y: 58.4,
    status: "damaged",
    level: 3,
    connections: ["heartlight", "archive_gate", "innovation_lab"],
    district: "Healing Gardens",
  },
  {
    id: "archive_gate",
    name: "Archive Gate",
    subtitle: "First expedition",
    x: 33.6,
    y: 54.2,
    status: "active",
    level: 3,
    connections: ["academy", "healing_gardens"],
    district: "Archive Ruins",
  },
  {
    id: "innovation_lab",
    name: "Innovation Spire",
    subtitle: "Creation quests",
    x: 67.4,
    y: 55.8,
    status: "locked",
    level: 4,
    connections: ["power_grid", "healing_gardens"],
    district: "Innovation Lab",
  },
  {
    id: "community_quarter",
    name: "Bridge Quarter",
    subtitle: "Connection tasks",
    x: 50.5,
    y: 34.6,
    status: "locked",
    level: 4,
    connections: ["heartlight", "academy", "power_grid"],
    district: "Community Quarter",
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

  // BFS for multi-hop routes
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
