"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { RpgLeaderRow } from "@/modules/rpg/types";

export function CityLeaderStream({
  rows,
  youId,
}: {
  rows: RpgLeaderRow[];
  youId: string;
}) {
  const [cursor, setCursor] = useState(0);

  useEffect(() => {
    if (rows.length < 2) return;
    const timer = window.setInterval(() => {
      setCursor((current) => (current + 1) % rows.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, [rows.length]);

  if (rows.length === 0) return null;

  const visible = [0, 1, 2]
    .map((offset) => rows[(cursor + offset) % rows.length])
    .filter((row, index, list) => list.findIndex((item) => item.user_id === row.user_id) === index);

  return (
    <aside
      aria-label="Traveler leaderboard"
      className="absolute right-4 bottom-28 z-40 w-[220px] sm:right-5 sm:bottom-32"
    >
      <Link href="/ranks" className="block text-right transition hover:opacity-90">
        <p className="mb-2 font-display text-[9px] tracking-[0.28em] text-white/45 uppercase">
          Live ranks
        </p>
        <div className="relative h-36 overflow-hidden">
          <ul className="flex flex-col justify-end gap-1.5">
            {visible.map((row, index) => {
              const you = row.user_id === youId;
              return (
                <li
                  key={`${row.user_id}-${cursor}-${index}`}
                  className="city-live-rise text-right"
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <p className={`text-[11px] leading-4 ${you ? "text-white/85" : "text-white/55"}`}>
                    <span className="font-display text-[10px] tracking-[0.14em] text-white/40">
                      #{row.rank}
                    </span>{" "}
                    {row.name}
                  </p>
                  <p className="text-[10px] text-white/35">
                    {row.cards}/4 cards · {row.points} score
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </Link>
    </aside>
  );
}
