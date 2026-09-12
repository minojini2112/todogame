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
import CityArrival from "./CityArrival";

/** Single city image — no tiled copies. */
const MAP_W = 2400;
const MAP_H = 1600;

function clampPan(
  panX: number,
  panY: number,
  zoom: number,
  viewW: number,
  viewH: number,
) {
  const scaledW = MAP_W * zoom;
  const scaledH = MAP_H * zoom;

  let nextX = panX;
  let nextY = panY;

  if (scaledW <= viewW) {
    nextX = (viewW - scaledW) / 2;
  } else {
    nextX = Math.min(0, Math.max(viewW - scaledW, panX));
  }

  if (scaledH <= viewH) {
    nextY = (viewH - scaledH) / 2;
  } else {
    nextY = Math.min(0, Math.max(viewH - scaledH, panY));
  }

  return { x: nextX, y: nextY };
}

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
  const finishTravelStep = useCityMapStore((s) => s.finishTravelStep);

  const applyPan = useCallback(
    (x: number, y: number, nextZoom = zoom) => {
      const viewport = viewportRef.current;
      if (!viewport) {
        setPan(x, y);
        return;
      }
      const { width, height } = viewport.getBoundingClientRect();
      const clamped = clampPan(x, y, nextZoom, width, height);
      setPan(clamped.x, clamped.y);
    },
    [setPan, zoom],
  );

  const centerOnTower = useCallback(
    (id: TowerId, nextZoom = useCityMapStore.getState().zoom) => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      const tower = TOWER_MAP[id];
      const { width, height } = viewport.getBoundingClientRect();
      const worldX = (tower.x / 100) * MAP_W * nextZoom;
      const worldY = (tower.y / 100) * MAP_H * nextZoom;
      applyPan(width / 2 - worldX, height / 2 - worldY, nextZoom);
    },
    [applyPan],
  );

  useEffect(() => {
    centerOnTower(currentTowerId);
  }, [currentTowerId, centerOnTower]);

  useEffect(() => {
    if (!focusTargetId || focusNonce === 0) return;
    const id = requestAnimationFrame(() => centerOnTower(focusTargetId));
    return () => cancelAnimationFrame(id);
  }, [focusNonce, focusTargetId, centerOnTower]);

  useEffect(() => {
    if (!isTraveling || travelPath.length === 0) return;
    const delay = reduceMotion ? 120 : 700;
    const timer = window.setTimeout(() => finishTravelStep(), delay);
    return () => window.clearTimeout(timer);
  }, [isTraveling, travelPath, finishTravelStep, reduceMotion]);

  useEffect(() => {
    const onResize = () => applyPan(panX, panY, zoom);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [applyPan, panX, panY, zoom]);

  const onWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const viewport = viewportRef.current;
    if (!viewport) return;

    const rect = viewport.getBoundingClientRect();
    const cursorX = event.clientX - rect.left;
    const cursorY = event.clientY - rect.top;

    const delta = event.deltaY > 0 ? -0.12 : 0.12;
    const nextZoom = Math.min(2.6, Math.max(0.7, zoom + delta));
    if (nextZoom === zoom) return;

    const worldX = (cursorX - panX) / zoom;
    const worldY = (cursorY - panY) / zoom;
    setZoom(nextZoom);
    applyPan(cursorX - worldX * nextZoom, cursorY - worldY * nextZoom, nextZoom);
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
    applyPan(panX + dx, panY + dy);
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

  return (
    <div className="relative h-dvh min-h-[640px] w-full overflow-hidden bg-[#0a1624]">
      <div
        ref={viewportRef}
        className="absolute inset-0 touch-none cursor-grab active:cursor-grabbing"
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClick={() => {
          if (dragRef.current.moved) return;
          selectTower(currentTowerId);
        }}
        role="application"
        aria-label="Aurelia city map. Drag to look around. Travel moves to the next location."
      >
        <div
          className="absolute left-0 top-0 origin-top-left will-change-transform"
          style={{
            width: MAP_W,
            height: MAP_H,
            transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
            transition: reduceMotion ? undefined : "transform 80ms linear",
          }}
        >
          <div className="relative h-full w-full overflow-hidden">
            <Image
              src="/aurelia/home-city.png"
              alt="Aurelia"
              fill
              priority
              sizes="2400px"
              className="object-cover object-center select-none"
              draggable={false}
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
      <CityArrival />
    </div>
  );
}
