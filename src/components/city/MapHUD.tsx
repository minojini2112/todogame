"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { TOWERS } from "@/lib/city/towers";
import { SPIRIT_UNLOCK } from "@/modules/rpg/spirits";
import type { RpgLeaderRow, RpgSpiritProgress } from "@/modules/rpg/types";
import { useCityMapStore } from "@/store/cityMapStore";
import { CityStoryLine } from "@/components/city/CityStoryLine";
import { CityLeaderStream } from "@/components/city/CityLeaderStream";
import { SignOutButton } from "@/modules/rpg/components/SignOutButton";
import { cn } from "@/lib/utils";

export default function MapHUD({
  spirits,
  recovered,
  onZoomBy,
  onReset,
  leaderboard,
  youId,
}: {
  spirits: RpgSpiritProgress[];
  recovered: boolean;
  onZoomBy: (delta: number) => void;
  onReset: () => void;
  leaderboard: RpgLeaderRow[];
  youId: string;
}) {
  const zoom = useCityMapStore((s) => s.zoom);
  const awakeCount = TOWERS.filter((tower) => {
    const points = spirits.find((row) => row.spirit_id === tower.spiritId)?.points ?? 0;
    return points >= SPIRIT_UNLOCK;
  }).length;

  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-start justify-between gap-3 p-4 select-none sm:p-5">
        <div className="pointer-events-auto rounded-2xl border border-white/10 bg-void/70 px-4 py-3 backdrop-blur-xl select-none">
          <p className="font-display text-[10px] tracking-[0.28em] text-cyan uppercase">
            Spirit stones
          </p>
          <p className="mt-1 font-display text-sm tracking-wide text-text">
            {awakeCount} / {TOWERS.length} awake
          </p>
          <p className="mt-1 max-w-[220px] text-xs leading-5 text-muted">
            {recovered
              ? "All four are awake. Aurelia is recovering."
              : "These are not a path. Wake each spirit. When all are collected, the city returns."}
          </p>
        </div>

        <div className="pointer-events-auto flex flex-col items-end gap-2">
          <nav
            aria-label="App"
            className="flex flex-wrap items-center justify-end gap-1 rounded-full border border-white/10 bg-void/70 p-1 backdrop-blur-xl sm:gap-1.5"
          >
            <CityNavLink href="/board">Quests</CityNavLink>
            <CityNavLink href="/vault">Vault</CityNavLink>
            <CityNavLink href="/city" active>
              Map
            </CityNavLink>
            <SignOutButton tone="city" />
          </nav>

          <div className="flex overflow-hidden rounded-full border border-white/10 bg-void/70 backdrop-blur-xl">
            <button
              type="button"
              aria-label="Zoom out"
              className="px-3 py-2 text-muted transition hover:bg-white/5 hover:text-text"
              onClick={() => onZoomBy(-0.15)}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="flex min-w-14 items-center justify-center border-x border-white/10 px-2 font-display text-[11px] text-text">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              aria-label="Zoom in"
              className="px-3 py-2 text-muted transition hover:bg-white/5 hover:text-text"
              onClick={() => onZoomBy(0.15)}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            aria-label="Reset camera"
            className="rounded-full border border-white/10 bg-void/70 p-2 text-muted backdrop-blur-xl transition hover:text-gold"
            onClick={onReset}
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <CityLeaderStream rows={leaderboard} youId={youId} />
      <CityStoryLine spirits={spirits} recovered={recovered} />
    </>
  );
}

function CityNavLink({
  href,
  active = false,
  children,
}: {
  href: string;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-full px-3.5 py-1.5 font-display text-[11px] tracking-[0.16em] uppercase transition sm:px-4",
        active
          ? "bg-heartlight/15 text-heartlight shadow-[0_0_16px_rgba(85,230,255,0.2)]"
          : "text-muted hover:bg-white/5 hover:text-text",
      )}
    >
      {children}
    </Link>
  );
}
