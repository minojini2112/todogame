"use client";

import { TOWERS, TOWER_MAP, type TowerId } from "@/lib/city/towers";

type Props = {
  currentId: TowerId;
  selectedId: TowerId | null;
  unlockedIds: TowerId[];
};

function pairKey(a: TowerId, b: TowerId) {
  return [a, b].sort().join("::");
}

export default function PathNetwork({
  currentId,
  selectedId,
  unlockedIds,
}: Props) {
  const drawn = new Set<string>();
  const edges: Array<{
    key: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    active: boolean;
    locked: boolean;
  }> = [];

  for (const tower of TOWERS) {
    for (const nextId of tower.connections) {
      const key = pairKey(tower.id, nextId);
      if (drawn.has(key)) continue;
      drawn.add(key);

      const next = TOWER_MAP[nextId];
      const locked =
        !unlockedIds.includes(tower.id) ||
        !unlockedIds.includes(nextId) ||
        tower.status === "locked" ||
        next.status === "locked";

      const active =
        (tower.id === currentId && nextId === selectedId) ||
        (nextId === currentId && tower.id === selectedId) ||
        tower.id === currentId ||
        nextId === currentId;

      edges.push({
        key,
        x1: tower.x,
        y1: tower.y,
        x2: next.x,
        y2: next.y,
        active,
        locked,
      });
    }
  }

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      {edges.map((edge) => (
        <line
          key={edge.key}
          x1={edge.x1}
          y1={edge.y1}
          x2={edge.x2}
          y2={edge.y2}
          stroke={
            edge.locked
              ? "rgba(157,176,199,0.18)"
              : edge.active
                ? "rgba(85,230,255,0.75)"
                : "rgba(255,200,87,0.35)"
          }
          strokeWidth={edge.active ? 0.35 : 0.22}
          strokeDasharray={edge.locked ? "1.2 1.2" : edge.active ? "0" : "0.8 0.8"}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
