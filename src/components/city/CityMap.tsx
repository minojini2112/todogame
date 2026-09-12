"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import { useReducedMotion } from "motion/react";
import {
  TOWERS,
  TOWER_MAP,
  areConnected,
  type TowerId,
} from "@/lib/city/towers";
import { useCityMapStore } from "@/store/cityMapStore";
import PathNetwork from "./PathNetwork";
import PlayerMarker from "./PlayerMarker";
import TowerMarker from "./TowerMarker";
import MapHUD from "./MapHUD";

/** Base map plate size in CSS px (scaled by zoom). */
const MAP_WIDTH = 2400;
const MAP_HEIGHT = 1600;

export default function CityMap() {
  const reduceMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    active: boolean;
    pointerId: number | null;
    lastX: number;
    lastY: number;
    moved: boolean;
  }>({ active: false, pointerId: null, lastX: 0, lastY: 0, moved: false });

  const zoom = useCityMapStore((s) => s.zoom);
  const panX = useCityMapStore((s) => s.panX);
  const panY = useCityMapStore((s) => s.panY);
  const currentTowerId = useCityMapStore((s) => s.currentTowerId);
  const selectedTowerId = useCityMapStore((s) => s.selectedTowerId);
  const isTraveling = useCityMapStore((s) => s.isTraveling);
  const travelPath = useCityMapStore((s) => s.travelPath);
  const unlockedTowerIds = useCityMapStore((s) => s.unlockedTowerIds);
  const focusNonce = useCityMapStore((s) => s.focusNonce);
  const focusTargetId = useCityMapStore((s) => s.focusTargetId);
  const selectTower = useCityMapStore((s) => s.selectTower);
  const setZoom = useCityMapStore((s) => s.setZoom);
  const setPan = useCityMapStore((s) => s.setPan);
  const panBy = useCityMapStore((s) => s.panBy);
  const finishTravelStep = useCityMapStore((s) => s.finishTravelStep);

  const centerOnTower = useCallback(
    (id: TowerId, nextZoom = useCityMapStore.getState().zoom) => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      const tower = TOWER_MAP[id];
      const { width, height } = viewport.getBoundingClientRect();
      const worldX = (tower.x / 100) * MAP_WIDTH * nextZoom;
      const worldY = (tower.y / 100) * MAP_HEIGHT * nextZoom;
      setPan(width / 2 - worldX, height / 2 - worldY);
    },
    [setPan],
  );

  // Keep player in view while traveling (skip when an explicit focus just fired)
  useEffect(() => {
    centerOnTower(currentTowerId);
  }, [currentTowerId, centerOnTower]);

  // Explicit focus / reset camera
  useEffect(() => {
    if (!focusTargetId || focusNonce === 0) return;
    const id = requestAnimationFrame(() => centerOnTower(focusTargetId));
    return () => cancelAnimationFrame(id);
  }, [focusNonce, focusTargetId, centerOnTower]);

  // Step through multi-hop travel
  useEffect(() => {
    if (!isTraveling || travelPath.length === 0) return;
    const delay = reduceMotion ? 120 : 700;
    const timer = window.setTimeout(() => finishTravelStep(), delay);
    return () => window.clearTimeout(timer);
  }, [isTraveling, travelPath, finishTravelStep, reduceMotion]);

  const onWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const viewport = viewportRef.current;
    if (!viewport) return;

    const rect = viewport.getBoundingClientRect();
    const cursorX = event.clientX - rect.left;
    const cursorY = event.clientY - rect.top;

    const delta = event.deltaY > 0 ? -0.12 : 0.12;
    const nextZoom = Math.min(2.6, Math.max(0.55, zoom + delta));
    if (nextZoom === zoom) return;

    // Zoom toward cursor
    const worldX = (cursorX - panX) / zoom;
    const worldY = (cursorY - panY) / zoom;
    setZoom(nextZoom);
    setPan(cursorX - worldX * nextZoom, cursorY - worldY * nextZoom);
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    dragRef.current = {
      active: true,
      pointerId: event.pointerId,
      lastX: event.clientX,
      lastY: event.clientY,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.active || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.lastX;
    const dy = event.clientY - drag.lastY;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) drag.moved = true;
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;
    panBy(dx, dy);
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (drag.pointerId === event.pointerId) {
      drag.active = false;
      drag.pointerId = null;
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        /* already released */
      }
    }
  };

  const onBackgroundClick = () => {
    if (dragRef.current.moved) return;
    selectTower(currentTowerId);
  };

  return (
    <div className="relative h-dvh min-h-[640px] w-full overflow-hidden bg-void">
      <div
        ref={viewportRef}
        className="absolute inset-0 touch-none cursor-grab active:cursor-grabbing"
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClick={onBackgroundClick}
        role="application"
        aria-label="Aurelia city map. Scroll to zoom, drag to pan, select towers to travel."
      >
        <div
          className="absolute left-0 top-0 origin-top-left will-change-transform"
          style={{
            width: MAP_WIDTH,
            height: MAP_HEIGHT,
            transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
            transition: reduceMotion ? undefined : "transform 80ms linear",
          }}
        >
          <div className="relative h-full w-full overflow-hidden rounded-[2px]">
            <Image
              src="/aurelia/home-city.png"
              alt=""
              fill
              priority
              sizes="2400px"
              className="object-cover object-center select-none"
              draggable={false}
            />

            {/* Soft game tint so markers read clearly */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 55%, rgba(7,17,31,0.22) 100%)",
              }}
            />

            <PathNetwork
              currentId={currentTowerId}
              selectedId={selectedTowerId}
              unlockedIds={unlockedTowerIds}
            />

            <PlayerMarker towerId={currentTowerId} isTraveling={isTraveling} />

            {TOWERS.map((tower) => {
              const unlocked = unlockedTowerIds.includes(tower.id);
              const reachable =
                unlocked &&
                tower.status !== "locked" &&
                areConnected(currentTowerId, tower.id) &&
                tower.id !== currentTowerId;

              return (
                <TowerMarker
                  key={tower.id}
                  tower={tower}
                  isCurrent={tower.id === currentTowerId}
                  isSelected={tower.id === selectedTowerId}
                  isReachable={reachable}
                  unlocked={unlocked}
                  onSelect={() => selectTower(tower.id)}
                />
              );
            })}
          </div>
        </div>
      </div>

      <MapHUD />
    </div>
  );
}
