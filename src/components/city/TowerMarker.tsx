"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TowerNode } from "@/lib/city/towers";
import { SPIRIT_UNLOCK, spiritFill } from "@/modules/rpg/spirits";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Props = {
  tower: TowerNode;
  points: number;
  isSelected: boolean;
  awake: boolean;
  onSelect: () => void;
};

export default function TowerMarker({ tower, points, isSelected, awake, onSelect }: Props) {
  const reduced = useReducedMotion();
  const fill = spiritFill(points);
  const fillPct = Math.round(fill * 100);
  const floatLeft = tower.cardSide === "left";

  const details = (
    <SpiritFloat
      tower={tower}
      points={points}
      awake={awake}
      fillPct={fillPct}
      emphasized={isSelected}
      side={tower.cardSide}
      reduced={reduced}
    />
  );

  return (
    <div
      className="absolute z-20 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 select-none [-webkit-user-drag:none]"
      style={{ left: `${tower.x}%`, top: `${tower.y}%` }}
    >
      {floatLeft ? details : null}

      <button
        type="button"
        aria-label={`${tower.name}, ${points} of ${SPIRIT_UNLOCK}${awake ? ", awake" : ", still sleeping"}`}
        aria-expanded={isSelected}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        className="group relative flex shrink-0 cursor-pointer flex-col items-center outline-none"
      >
        {/* Dark plate behind figure + seal */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-[-1.75rem] top-2 bottom-6 rounded-[40%] bg-[radial-gradient(ellipse_at_center,rgba(7,17,31,0.88)_35%,rgba(7,17,31,0.45)_65%,transparent_78%)]"
        />

        {/* Companion floats outside the ring */}
        <motion.span
          className={cn(
            "relative z-10 mb-[-1.1rem] block h-[7.5rem] w-[7.5rem]",
            isSelected && "scale-105",
            !isSelected && "group-hover:scale-[1.04]",
          )}
          animate={reduced ? undefined : { y: [0, -5, 0] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src={tower.image}
            alt=""
            fill
            sizes="160px"
            className={cn(
              "pointer-events-none object-contain select-none drop-shadow-[0_10px_22px_rgba(0,0,0,0.8)] [-webkit-user-drag:none]",
              !awake && "grayscale-[0.25] brightness-95 contrast-110",
              awake && "brightness-110 drop-shadow-[0_0_20px_rgba(255,200,87,0.35)]",
            )}
            draggable={false}
            priority={false}
          />
        </motion.span>

        {/* Progress seal — lock lives inside this circle */}
        <span
          className={cn(
            "relative z-0 flex h-14 w-14 items-center justify-center rounded-full p-[3px] shadow-[0_6px_18px_rgba(0,0,0,0.55)] transition duration-200",
            isSelected && "scale-110",
          )}
          style={{
            background: `conic-gradient(#ffc857 ${Math.round(fill * 360)}deg, rgba(255,255,255,0.2) 0deg)`,
          }}
        >
          {!reduced && (isSelected || awake) ? (
            <motion.span
              aria-hidden
              className={cn(
                "pointer-events-none absolute -inset-1.5 rounded-full border",
                awake ? "border-gold/50" : "border-heartlight/35",
              )}
              animate={{ opacity: [0.25, 0.7, 0.25], scale: [1, 1.1, 1] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            />
          ) : null}
          <span
            className={cn(
              "relative flex h-full w-full items-center justify-center rounded-full border bg-[#050b14]",
              awake ? "border-[#ffc857]/80" : "border-white/25",
              isSelected && !awake && "border-heartlight/50",
            )}
          >
            {!awake ? <Lock className="h-4 w-4 text-white/90" /> : null}
          </span>
        </span>

        <span className="relative z-10 mt-1.5 rounded-full border border-white/20 bg-[#07111f]/92 px-2.5 py-0.5 shadow-[0_4px_16px_rgba(0,0,0,0.45)] backdrop-blur-md">
          <span className="block font-display text-[11px] tracking-[0.14em] text-[#f2f8ff] uppercase">
            {tower.name}
          </span>
        </span>
      </button>

      {!floatLeft ? details : null}
    </div>
  );
}

function SpiritFloat({
  tower,
  points,
  awake,
  fillPct,
  emphasized,
  side,
  reduced,
}: {
  tower: TowerNode;
  points: number;
  awake: boolean;
  fillPct: number;
  emphasized: boolean;
  side: "left" | "right";
  reduced: boolean;
}) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, x: side === "left" ? 8 : -8 }}
      animate={{
        opacity: 1,
        x: 0,
        y: reduced ? 0 : [0, -3, 0],
      }}
      transition={{
        opacity: { duration: 0.35 },
        x: { duration: 0.35 },
        y: reduced
          ? undefined
          : { duration: 4.2, repeat: Infinity, ease: "easeInOut" },
      }}
      className={cn(
        "pointer-events-auto relative w-[min(70vw,220px)] select-none rounded-2xl border border-white/12 bg-[#07111f]/92 px-4 py-3.5 shadow-[0_12px_36px_rgba(0,0,0,0.55)] backdrop-blur-xl",
        side === "left" ? "text-right" : "text-left",
        emphasized &&
          "border-heartlight/30 shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(85,230,255,0.12)]",
      )}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 rounded-2xl",
          awake
            ? "bg-[radial-gradient(ellipse_at_top,rgba(255,200,87,0.12),transparent_60%)]"
            : "bg-[radial-gradient(ellipse_at_top,rgba(85,230,255,0.1),transparent_60%)]",
        )}
      />

      <p
        className={cn(
          "relative font-display text-[10px] tracking-[0.26em] uppercase",
          awake ? "text-gold" : "text-heartlight",
        )}
      >
        {tower.subtitle}
        <span className="mx-1 text-white/25">·</span>
        <span className="text-muted">{awake ? "Awake" : "Still sleeping"}</span>
      </p>

      <p className="relative mt-2 text-sm leading-5 text-[#d7e4f4]">{tower.district}</p>

      <div className="relative mt-3 h-1.5 w-full overflow-hidden rounded-full bg-black/45">
        <motion.div
          className="h-full rounded-full bg-[linear-gradient(90deg,#55e6ff,#ffc857)]"
          initial={reduced ? false : { width: 0 }}
          animate={{ width: `${fillPct}%` }}
          transition={{ duration: reduced ? 0 : 0.7 }}
        />
      </div>

      <p className="relative mt-2 font-display text-xs tracking-[0.14em] text-gold uppercase">
        {points} / {SPIRIT_UNLOCK}
      </p>

      <Link
        href="/vault"
        className="relative mt-2.5 inline-flex font-display text-[10px] tracking-[0.18em] text-heartlight uppercase transition hover:text-[#9af3ff]"
      >
        Open vault →
      </Link>
    </motion.div>
  );
}
