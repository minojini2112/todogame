export type TowerId =
  | "dawn_hall"
  | "river_bridge"
  | "colonnade"
  | "heartlight_ring"
  | "apex_spire";

export type TowerStatus = "restored" | "active" | "damaged" | "locked";

export interface TowerNode {
  id: TowerId;
  name: string;
  subtitle: string;
  x: number;
  y: number;
  status: TowerStatus;
  level: number;
  connections: TowerId[];
  district: string;
}

/**
 * Linear restoration path across the Aurelia plate.
 * 1 hall → 2 bridge → 3 colonnade → 4 heartlight ring → 5 apex (save the city)
 */
export const TOWERS: TowerNode[] = [
  {
    id: "dawn_hall",
    name: "Dawn Hall",
    subtitle: "First location",
    x: 38.2,
    y: 63.8,
    status: "active",
    level: 1,
    connections: ["river_bridge"],
    district: "Outer Sanctum",
  },
  {
    id: "river_bridge",
    name: "River Bridge",
    subtitle: "Cross the canal",
    x: 65.8,
    y: 61.6,
    status: "damaged",
    level: 2,
    connections: ["dawn_hall", "colonnade"],
    district: "Canal Crossing",
  },
  {
    id: "colonnade",
    name: "Gold Colonnade",
    subtitle: "The inner court",
    x: 54.6,
    y: 52.4,
    status: "damaged",
    level: 3,
    connections: ["river_bridge", "heartlight_ring"],
    district: "Palace Court",
  },
  {
    id: "heartlight_ring",
    name: "Heartlight Ring",
    subtitle: "Command nexus",
    x: 50.2,
    y: 47.2,
    status: "damaged",
    level: 4,
    connections: ["colonnade", "apex_spire"],
    district: "Heartlight Core",
  },
  {
    id: "apex_spire",
    name: "Apex Spire",
    subtitle: "Save the city",
    x: 50.2,
    y: 27.6,
    status: "damaged",
    level: 5,
    connections: ["heartlight_ring"],
    district: "The Last Light",
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
