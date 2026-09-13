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
import { usePhoneLayout } from "@/hooks/usePhoneLayout";
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
  const phone = usePhoneLayout();
  const awakeCount = TOWERS.filter((tower) => {
    const points = spirits.find((row) => row.spirit_id === tower.spiritId)?.points ?? 0;
    return points >= SPIRIT_UNLOCK;
  }).length;

  if (phone) {
    return (
      <>
        <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-center justify-between gap-2 px-[max(0.5rem,env(safe-area-inset-left))] pr-[max(0.5rem,env(safe-area-inset-right))] pt-[max(0.4rem,env(safe-area-inset-top))]">
          <p className="pointer-events-none rounded-full border border-white/10 bg-void/75 px-2.5 py-1 font-display text-[10px] tracking-[0.14em] text-cyan uppercase backdrop-blur-xl">
            {awakeCount}/{TOWERS.length} awake
          </p>
          <nav
            aria-label="App"
            className="pointer-events-auto flex items-center rounded-full border border-white/10 bg-void/75 p-0.5 backdrop-blur-xl"
          >
            <CityNavLink href="/board" tight>
              Quests
            </CityNavLink>
            <CityNavLink href="/vault" tight>
              Vault
            </CityNavLink>
            <CityNavLink href="/city" active tight>
              Map
            </CityNavLink>
            <SignOutButton tone="city" className="px-2 py-1 text-[10px] tracking-[0.12em]" />
          </nav>
        </div>

        <div className="pointer-events-auto absolute top-1/2 right-[max(0.45rem,env(safe-area-inset-right))] z-40 flex -translate-y-1/2 flex-col items-center gap-1.5">
          <div className="flex flex-col overflow-hidden rounded-full border border-white/10 bg-void/75 backdrop-blur-xl">
            <button
              type="button"
              aria-label="Zoom in"
              className="px-2 py-2 text-muted"
              onClick={() => onZoomBy(0.15)}
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
            <span className="border-y border-white/10 px-1.5 py-1 text-center font-display text-[9px] text-text">
              {Math.round(zoom * 100)}
            </span>
            <button
              type="button"
              aria-label="Zoom out"
              className="px-2 py-2 text-muted"
              onClick={() => onZoomBy(-0.15)}
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
          </div>
          <button
            type="button"
            aria-label="Reset camera"
            className="rounded-full border border-white/10 bg-void/75 p-1.5 text-muted backdrop-blur-xl"
            onClick={onReset}
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>

        <CityLeaderStream rows={leaderboard} youId={youId} compact />
        <CityStoryLine spirits={spirits} recovered={recovered} compact />
      </>
    );
  }

  return (
    <>
      <div className="map-hud-top pointer-events-none absolute inset-x-0 top-0 z-40 flex items-start justify-between gap-3 p-4 select-none sm:p-5">
        <div className="pointer-events-auto rounded-2xl border border-white/10 bg-void/70 px-4 py-3 backdrop-blur-xl select-none">
          <p className="font-display text-[10px] tracking-[0.28em] text-cyan uppercase">
            Spirit stones
          </p>
          <p className="mt-1 font-display text-sm tracking-wide text-text">
            {awakeCount} / {TOWERS.length} awake
          </p>
          <p className="map-hud-blurb mt-1 max-w-[220px] text-xs leading-5 text-muted">
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
  tight = false,
  children,
}: {
  href: string;
  active?: boolean;
  tight?: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      data-sfx="click"
      className={cn(
        "rounded-full font-display uppercase transition",
        tight
          ? "px-2 py-1 text-[10px] tracking-[0.12em]"
          : "px-3.5 py-1.5 text-[11px] tracking-[0.16em] sm:px-4",
        active
          ? "bg-heartlight/15 text-heartlight shadow-[0_0_16px_rgba(85,230,255,0.2)]"
          : "text-muted hover:bg-white/5 hover:text-text",
      )}
    >
      {children}
    </Link>
  );
}
