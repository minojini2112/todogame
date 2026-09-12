"use client";

import {
  Compass,
  Focus,
  Lock,
  MapPinned,
  Minus,
  Plus,
  RotateCcw,
  Footprints,
} from "lucide-react";
import { TOWER_MAP, areConnected } from "@/lib/city/towers";
import { CITY_ZOOM, useCityMapStore } from "@/store/cityMapStore";
import { cn } from "@/lib/utils";

export default function MapHUD() {
  const currentTowerId = useCityMapStore((s) => s.currentTowerId);
  const selectedTowerId = useCityMapStore((s) => s.selectedTowerId);
  const zoom = useCityMapStore((s) => s.zoom);
  const isTraveling = useCityMapStore((s) => s.isTraveling);
  const unlockedTowerIds = useCityMapStore((s) => s.unlockedTowerIds);
  const travelTo = useCityMapStore((s) => s.travelTo);
  const zoomBy = useCityMapStore((s) => s.zoomBy);
  const resetCamera = useCityMapStore((s) => s.resetCamera);
  const focusTower = useCityMapStore((s) => s.focusTower);
  const selectTower = useCityMapStore((s) => s.selectTower);

  const current = TOWER_MAP[currentTowerId];
  const selected = selectedTowerId ? TOWER_MAP[selectedTowerId] : null;

  const canTravel =
    !!selected &&
    selected.id !== currentTowerId &&
    unlockedTowerIds.includes(selected.id) &&
    selected.status !== "locked" &&
    !isTraveling;

  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-start justify-between gap-3 p-4 sm:p-5">
        <div className="pointer-events-auto rounded-2xl border border-white/10 bg-void/70 px-4 py-3 backdrop-blur-xl">
          <p className="font-display text-[10px] tracking-[0.28em] text-cyan uppercase">
            Aurelia Map
          </p>
          <div className="mt-1 flex items-center gap-2">
            <MapPinned className="h-4 w-4 text-gold" />
            <div>
              <p className="font-display text-sm tracking-wide text-text">
                {current.name}
              </p>
              <p className="text-xs text-muted">{current.district}</p>
            </div>
          </div>
        </div>

        <div className="pointer-events-auto flex flex-col items-end gap-2">
          <div className="flex overflow-hidden rounded-full border border-white/10 bg-void/70 backdrop-blur-xl">
            <button
              type="button"
              aria-label="Zoom out"
              className="px-3 py-2 text-muted transition hover:bg-white/5 hover:text-text"
              onClick={() => zoomBy(-0.15)}
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
              onClick={() => zoomBy(0.15)}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Focus current tower"
              className="rounded-full border border-white/10 bg-void/70 p-2 text-muted backdrop-blur-xl transition hover:text-cyan"
              onClick={() => {
                selectTower(currentTowerId);
                focusTower(currentTowerId);
              }}
            >
              <Focus className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Reset camera"
              className="rounded-full border border-white/10 bg-void/70 p-2 text-muted backdrop-blur-xl transition hover:text-gold"
              onClick={resetCamera}
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 p-4 sm:p-5">
        <div className="pointer-events-auto mx-auto flex max-w-xl flex-col gap-3 rounded-2xl border border-white/10 bg-void/75 p-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          {selected ? (
            <>
              <div className="min-w-0">
                <p className="font-display text-[10px] tracking-[0.24em] text-muted uppercase">
                  Target Tower · Level {selected.level}
                  {areConnected(currentTowerId, selected.id)
                    ? " · Linked"
                    : selected.id === currentTowerId
                      ? ""
                      : " · Route via bridges"}
                </p>
                <h2 className="truncate font-display text-lg tracking-wide text-text">
                  {selected.name}
                </h2>
                <p className="text-sm text-muted">
                  {selected.subtitle} · {selected.district}
                </p>
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-muted transition hover:border-cyan/40 hover:text-text"
                  onClick={() => focusTower(selected.id)}
                >
                  <Compass className="h-4 w-4" />
                  Focus
                </button>
                <button
                  type="button"
                  disabled={!canTravel || selected.status === "locked"}
                  onClick={() => travelTo(selected.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-4 py-2 font-display text-xs tracking-[0.16em] uppercase transition",
                    selected.status === "locked"
                      ? "cursor-not-allowed bg-white/5 text-muted"
                      : canTravel
                        ? "bg-cyan text-void hover:brightness-110"
                        : "cursor-not-allowed bg-white/5 text-muted",
                  )}
                >
                  {selected.status === "locked" ? (
                    <>
                      <Lock className="h-3.5 w-3.5" /> Locked
                    </>
                  ) : isTraveling ? (
                    "Traveling…"
                  ) : selected.id === currentTowerId ? (
                    "You are here"
                  ) : (
                    <>
                      <Footprints className="h-3.5 w-3.5" /> Travel
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted">
              Select a tower to travel. Scroll to zoom · drag to pan.
            </p>
          )}
        </div>

        <p className="mt-2 text-center text-[10px] tracking-wide text-muted/70">
          Zoom {CITY_ZOOM.min}x–{CITY_ZOOM.max}x · Move tower to tower along lit
          paths
        </p>
      </div>

      <div className="sr-only" aria-live="polite">
        {isTraveling
          ? `Traveling toward ${selected?.name ?? "tower"}`
          : `Located at ${current.name}`}
      </div>
    </>
  );
}
