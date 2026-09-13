"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { motion } from "framer-motion";
import type { RpgLeaderRow } from "@/modules/rpg/types";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const POSITION_KEY = "echobound.city.echo-chorus.pos.v1";
const PANEL_W = 252;
const EDGE = 16;

type Pos = { x: number; y: number };

function clampPos(x: number, y: number, width: number, height: number): Pos {
  const maxX = Math.max(EDGE, window.innerWidth - width - EDGE);
  const maxY = Math.max(EDGE, window.innerHeight - height - EDGE);
  return {
    x: Math.min(maxX, Math.max(EDGE, x)),
    y: Math.min(maxY, Math.max(EDGE, y)),
  };
}

function defaultPos(width: number, height: number): Pos {
  return clampPos(
    window.innerWidth - width - (window.innerWidth >= 640 ? 20 : 16),
    window.innerHeight - height - (window.innerWidth >= 640 ? 128 : 112),
    width,
    height,
  );
}

function readSavedPos(width: number, height: number): Pos | null {
  try {
    const raw = localStorage.getItem(POSITION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Pos;
    if (typeof parsed.x !== "number" || typeof parsed.y !== "number") return null;
    return clampPos(parsed.x, parsed.y, width, height);
  } catch {
    return null;
  }
}

export function CityLeaderStream({
  rows,
  youId,
  compact = false,
}: {
  rows: RpgLeaderRow[];
  youId: string;
  compact?: boolean;
}) {
  const reduced = useReducedMotion();
  const [cursor, setCursor] = useState(0);
  const [pos, setPos] = useState<Pos | null>(null);
  const [dragging, setDragging] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    offsetX: number;
    offsetY: number;
    moved: boolean;
  } | null>(null);

  useEffect(() => {
    if (rows.length < 2) return;
    const timer = window.setInterval(() => {
      setCursor((current) => (current + 1) % rows.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, [rows.length]);

  useEffect(() => {
    function place() {
      const el = panelRef.current;
      const width = el?.offsetWidth || PANEL_W;
      const height = el?.offsetHeight || 220;
      setPos((current) => {
        if (current) return clampPos(current.x, current.y, width, height);
        return readSavedPos(width, height) ?? defaultPos(width, height);
      });
    }
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, []);

  if (rows.length === 0) return null;

  if (compact) {
    const lead = rows[cursor % rows.length];
    return (
      <div className="pointer-events-auto absolute top-[3.25rem] left-[max(0.5rem,env(safe-area-inset-left))] z-40">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="rounded-full border border-white/15 bg-[#07111f]/90 px-3 py-1.5 font-display text-[10px] tracking-[0.16em] text-heartlight uppercase backdrop-blur-xl"
        >
          Chorus
        </button>
        {open && lead ? (
          <div className="mt-2 w-[min(70vw,220px)] rounded-2xl border border-heartlight/25 bg-[#07111f]/95 p-3 shadow-[0_12px_32px_rgba(0,0,0,0.55)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-2">
              <p className="font-splash text-base text-text">Echo Chorus</p>
              <Link
                href="/ranks"
                className="font-display text-[9px] tracking-[0.14em] text-muted uppercase"
              >
                All →
              </Link>
            </div>
            <p className="mt-2 truncate text-sm text-text">
              #{lead.rank} {lead.name}
            </p>
            <p className="mt-0.5 text-[11px] text-muted">
              {lead.cards}/4 spirits · {lead.points} echo
            </p>
          </div>
        ) : null}
      </div>
    );
  }

  const visible = [0, 1, 2]
    .map((offset) => rows[(cursor + offset) % rows.length])
    .filter((row, index, list) => list.findIndex((item) => item.user_id === row.user_id) === index);

  function onPointerDown(event: ReactPointerEvent<HTMLElement>) {
    if (event.button !== 0) return;
    // Let dedicated links receive clicks without starting a drag.
    const target = event.target as HTMLElement;
    if (target.closest("a")) return;

    const el = panelRef.current;
    if (!el || !pos) return;

    event.preventDefault();
    event.stopPropagation();
    el.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - pos.x,
      offsetY: event.clientY - pos.y,
      moved: false,
    };
    setDragging(true);
  }

  function onPointerMove(event: ReactPointerEvent<HTMLElement>) {
    const drag = dragRef.current;
    const el = panelRef.current;
    if (!drag || drag.pointerId !== event.pointerId || !el) return;
    event.preventDefault();
    event.stopPropagation();

    const next = clampPos(
      event.clientX - drag.offsetX,
      event.clientY - drag.offsetY,
      el.offsetWidth,
      el.offsetHeight,
    );
    if (Math.abs(next.x - (pos?.x ?? next.x)) > 2 || Math.abs(next.y - (pos?.y ?? next.y)) > 2) {
      drag.moved = true;
    }
    setPos(next);
  }

  function endDrag(event: ReactPointerEvent<HTMLElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    event.stopPropagation();
    try {
      panelRef.current?.releasePointerCapture(event.pointerId);
    } catch {
      /* already released */
    }
    if (pos && drag.moved) {
      try {
        localStorage.setItem(POSITION_KEY, JSON.stringify(pos));
      } catch {
        /* ignore quota */
      }
    }
    dragRef.current = null;
    setDragging(false);
  }

  return (
    <aside
      ref={panelRef}
      aria-label="Echo chorus of Aurelia. Drag to move."
      className={cn(
        "pointer-events-auto absolute z-40 w-[min(74vw,252px)] touch-none select-none [-webkit-touch-callout:none] [-webkit-user-drag:none]",
        dragging ? "cursor-grabbing" : "cursor-grab",
        pos ? "opacity-100" : "opacity-0",
      )}
      style={
        pos
          ? { left: pos.x, top: pos.y, right: "auto", bottom: "auto" }
          : { right: 16, bottom: 112 }
      }
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div
        className={cn(
          "group relative overflow-hidden rounded-[22px] border border-heartlight/20 bg-[#07111f]/93 shadow-[0_14px_40px_rgba(0,0,0,0.55),0_0_28px_rgba(85,230,255,0.08)] backdrop-blur-xl transition",
          dragging
            ? "border-heartlight/45 shadow-[0_18px_48px_rgba(0,0,0,0.65),0_0_36px_rgba(85,230,255,0.2)]"
            : "hover:border-heartlight/40 hover:shadow-[0_14px_44px_rgba(0,0,0,0.6),0_0_32px_rgba(85,230,255,0.16)]",
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(85,230,255,0.18),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(157,123,255,0.1),transparent_55%)]"
        />
        {!reduced ? (
          <div aria-hidden className="pointer-events-none absolute inset-0 sanctum-motes opacity-25 mix-blend-screen" />
        ) : null}
        {!reduced ? (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute -top-8 -right-6 size-24 rounded-full bg-heartlight/20 blur-2xl"
            animate={{ opacity: [0.25, 0.55, 0.25], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : null}

        <div className="relative px-3.5 pt-3.5 pb-3.5">
          <div className="mb-2 flex items-center justify-center gap-1">
            <span className="h-1 w-8 rounded-full bg-white/20" />
            <span className="font-display text-[8px] tracking-[0.22em] text-muted uppercase">
              Drag to place
            </span>
            <span className="h-1 w-8 rounded-full bg-white/20" />
          </div>

          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-display text-[9px] tracking-[0.3em] text-heartlight/80 uppercase">
                Aurelia listens
              </p>
              <p className="font-splash mt-0.5 text-xl leading-none text-text text-glow-cyan">
                Echo Chorus
              </p>
            </div>
            <Link
              href="/ranks"
              onClick={(event) => event.stopPropagation()}
              onPointerDown={(event) => event.stopPropagation()}
              className="mt-1 shrink-0 font-display text-[9px] tracking-[0.16em] text-muted uppercase transition hover:text-heartlight"
            >
              All echoes →
            </Link>
          </div>

          <p className="relative mt-2 text-[10px] leading-4 text-muted">
            Who walks brightest among the spirits tonight.
          </p>

          <ul className="relative mt-3 space-y-2">
            {visible.map((row, index) => {
              const you = row.user_id === youId;
              return (
                <li
                  key={`${row.user_id}-${cursor}-${index}`}
                  className={cn(
                    "city-live-rise flex items-start gap-2.5 rounded-xl border px-2.5 py-2",
                    you
                      ? "border-heartlight/35 bg-[linear-gradient(135deg,rgba(85,230,255,0.14),rgba(157,123,255,0.08))] shadow-[inset_0_0_20px_rgba(85,230,255,0.08)]"
                      : "border-white/10 bg-black/30",
                  )}
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <span
                    className={cn(
                      "relative mt-0.5 flex h-7 min-w-7 items-center justify-center rounded-full border font-display text-[10px] tracking-wide",
                      you
                        ? "border-heartlight/50 bg-heartlight/15 text-heartlight shadow-[0_0_12px_rgba(85,230,255,0.25)]"
                        : "border-gold/35 bg-gold/10 text-gold",
                    )}
                  >
                    {!reduced && you ? (
                      <motion.span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 rounded-full border border-heartlight/40"
                        animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.15, 1] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                      />
                    ) : null}
                    <span className="relative">{row.rank}</span>
                  </span>
                  <span className="min-w-0 flex-1 text-left">
                    <span
                      className={cn(
                        "block truncate text-[12px] leading-4",
                        you ? "text-text" : "text-[#d7e4f4]",
                      )}
                    >
                      {row.name}
                      {you ? (
                        <span className="ml-1.5 font-display text-[8px] tracking-[0.16em] text-heartlight uppercase">
                          Bound
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-0.5 block text-[10px] text-muted">
                      {row.cards}/4 spirits · {row.points} echo
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </aside>
  );
}
