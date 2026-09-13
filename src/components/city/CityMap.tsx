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
import { TOWERS } from "@/lib/city/towers";
import { SPIRIT_UNLOCK } from "@/modules/rpg/spirits";
import type { RpgLeaderRow, RpgSpiritProgress } from "@/modules/rpg/types";
import { useCityMapStore } from "@/store/cityMapStore";
import { MobileLandscapeShell } from "@/components/layout/MobileLandscapeShell";
import TowerMarker from "./TowerMarker";
import MapHUD from "./MapHUD";
import CityArrival from "./CityArrival";

/** Single city map plane — video (or still) scaled with pan/zoom. */
const MAP_W = 2400;
const MAP_H = 1600;
const MAX_ZOOM = 2.6;
const PREFERRED_ZOOM = 0.84;
const MAP_VIDEO = "/assets/citymap_video.mp4";
const MAP_STILL = "/aurelia/home-city.png";

function coverZoom(viewW: number, viewH: number) {
  return Math.max(viewW / MAP_W, viewH / MAP_H);
}

function clampZoom(zoom: number, viewW: number, viewH: number) {
  return Math.min(MAX_ZOOM, Math.max(coverZoom(viewW, viewH), zoom));
}

function clampPan(
  panX: number,
  panY: number,
  zoom: number,
  viewW: number,
  viewH: number,
) {
  const scaledW = MAP_W * zoom;
  const scaledH = MAP_H * zoom;

  const minX = Math.min(0, viewW - scaledW);
  const maxX = Math.max(0, viewW - scaledW);
  const minY = Math.min(0, viewH - scaledH);
  const maxY = Math.max(0, viewH - scaledH);

  return {
    x: Math.min(maxX, Math.max(minX, panX)),
    y: Math.min(maxY, Math.max(minY, panY)),
  };
}

function centerPan(zoom: number, viewW: number, viewH: number) {
  return clampPan((viewW - MAP_W * zoom) / 2, (viewH - MAP_H * zoom) / 2, zoom, viewW, viewH);
}

export default function CityMap({
  spirits,
  leaderboard,
  youId,
}: {
  spirits: RpgSpiritProgress[];
  leaderboard: RpgLeaderRow[];
  youId: string;
}) {
  const reduceMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
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
  const selectedTowerId = useCityMapStore((s) => s.selectedTowerId);
  const selectTower = useCityMapStore((s) => s.selectTower);
  const setZoom = useCityMapStore((s) => s.setZoom);
  const setPan = useCityMapStore((s) => s.setPan);
  const framed = useRef(false);
  const recovered = TOWERS.every((tower) => {
    const points = spirits.find((row) => row.spirit_id === tower.spiritId)?.points ?? 0;
    return points >= SPIRIT_UNLOCK;
  });

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

  const zoomToward = useCallback(
    (delta: number, origin?: { x: number; y: number }) => {
      const viewport = viewportRef.current;
      if (!viewport) {
        setZoom(Math.min(MAX_ZOOM, Math.max(PREFERRED_ZOOM, zoom + delta)));
        return;
      }

      const rect = viewport.getBoundingClientRect();
      const nextZoom = clampZoom(zoom + delta, rect.width, rect.height);
      if (nextZoom === zoom) return;

      const cursorX = origin?.x ?? rect.width / 2;
      const cursorY = origin?.y ?? rect.height / 2;
      const worldX = (cursorX - panX) / zoom;
      const worldY = (cursorY - panY) / zoom;
      setZoom(nextZoom);
      applyPan(cursorX - worldX * nextZoom, cursorY - worldY * nextZoom, nextZoom);
    },
    [applyPan, panX, panY, setZoom, zoom],
  );

  useEffect(() => {
    if (framed.current) return;
    const viewport = viewportRef.current;
    if (!viewport) return;
    const { width, height } = viewport.getBoundingClientRect();
    if (width < 8 || height < 8) return;
    framed.current = true;
    const nextZoom = clampZoom(PREFERRED_ZOOM, width, height);
    setZoom(nextZoom);
    const next = centerPan(nextZoom, width, height);
    setPan(next.x, next.y);
  }, [setPan, setZoom]);

  useEffect(() => {
    const onResize = () => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      const { width, height } = viewport.getBoundingClientRect();
      const nextZoom = clampZoom(zoom, width, height);
      if (nextZoom !== zoom) setZoom(nextZoom);
      applyPan(panX, panY, nextZoom);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [applyPan, panX, panY, setZoom, zoom]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduceMotion) return;
    video.muted = true;
    const play = () => {
      void video.play().catch(() => {
        /* autoplay can be blocked; muted + playsInline usually ok */
      });
    };
    play();
    video.addEventListener("canplay", play);
    return () => video.removeEventListener("canplay", play);
  }, [reduceMotion]);

  useEffect(() => {
    const root = viewportRef.current?.parentElement;
    const viewport = viewportRef.current;
    if (!root || !viewport) return;

    const blockSelect = (event: Event) => event.preventDefault();
    const blockDrag = (event: Event) => event.preventDefault();

    root.addEventListener("selectstart", blockSelect);
    viewport.addEventListener("selectstart", blockSelect);
    root.addEventListener("dragstart", blockDrag);
    return () => {
      root.removeEventListener("selectstart", blockSelect);
      viewport.removeEventListener("selectstart", blockSelect);
      root.removeEventListener("dragstart", blockDrag);
    };
  }, []);

  const onWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const viewport = viewportRef.current;
    if (!viewport) return;

    const rect = viewport.getBoundingClientRect();
    const cursorX = event.clientX - rect.left;
    const cursorY = event.clientY - rect.top;

    zoomToward(event.deltaY > 0 ? -0.12 : 0.12, { x: cursorX, y: cursorY });
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    window.getSelection()?.removeAllRanges();
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

  const mapTone = recovered
    ? "brightness-110 saturate-125"
    : "brightness-[0.88] saturate-[0.85]";

  return (
    <MobileLandscapeShell
      className="bg-[#0a1624]"
      hint="Turn your phone sideways to explore Aurelia"
    >
    <div className="city-map-root relative h-full min-h-[640px] w-full overflow-hidden bg-[#0a1624] select-none [@media(hover:none)_and_(pointer:coarse)]:min-h-0 [-webkit-user-drag:none] [-webkit-touch-callout:none]">
      <div
        ref={viewportRef}
        className="absolute inset-0 cursor-grab touch-none select-none active:cursor-grabbing"
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClick={() => {
          if (dragRef.current.moved) return;
          selectTower(null);
        }}
        role="application"
        aria-label="Aurelia map. The four spirits are stones. Wake them all to recover the city."
      >
        <div
          className="absolute top-0 left-0 origin-top-left will-change-transform"
          style={{
            width: MAP_W,
            height: MAP_H,
            transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
            transition: reduceMotion ? undefined : "transform 80ms linear",
          }}
        >
          <div className="relative h-full w-full overflow-hidden">
            {reduceMotion ? (
              <Image
                src={MAP_STILL}
                alt="Aurelia"
                fill
                priority
                sizes="2400px"
                className={`object-cover object-center select-none transition duration-700 ${mapTone}`}
                draggable={false}
              />
            ) : (
              <video
                ref={videoRef}
                className={`pointer-events-none absolute inset-0 h-full w-full object-cover object-center select-none transition duration-700 ${mapTone}`}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                disablePictureInPicture
                aria-hidden
                poster={MAP_STILL}
              >
                <source src={MAP_VIDEO} type="video/mp4" />
              </video>
            )}

            {TOWERS.map((tower) => {
              const points = spirits.find((row) => row.spirit_id === tower.spiritId)?.points ?? 0;
              const awake = points >= SPIRIT_UNLOCK;
              return (
                <TowerMarker
                  key={tower.id}
                  tower={tower}
                  points={points}
                  isSelected={tower.id === selectedTowerId}
                  awake={awake}
                  onSelect={() => selectTower(tower.id)}
                />
              );
            })}
          </div>
        </div>
      </div>

      <MapHUD
        spirits={spirits}
        recovered={recovered}
        leaderboard={leaderboard}
        youId={youId}
        onZoomBy={(delta) => zoomToward(delta)}
        onReset={() => {
          const viewport = viewportRef.current;
          if (!viewport) {
            setZoom(PREFERRED_ZOOM);
            setPan(0, 0);
            return;
          }
          const { width, height } = viewport.getBoundingClientRect();
          const nextZoom = clampZoom(PREFERRED_ZOOM, width, height);
          setZoom(nextZoom);
          const next = centerPan(nextZoom, width, height);
          setPan(next.x, next.y);
        }}
      />
      <CityArrival />
    </div>
    </MobileLandscapeShell>
  );
}
