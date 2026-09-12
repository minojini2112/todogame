"use client";

import Image from "next/image";
import Link from "next/link";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TowerNode } from "@/lib/city/towers";
import { SPIRIT_UNLOCK, spiritFill } from "@/modules/rpg/spirits";

type Props = {
  tower: TowerNode;
  points: number;
  isSelected: boolean;
  awake: boolean;
  onSelect: () => void;
};

export default function TowerMarker({ tower, points, isSelected, awake, onSelect }: Props) {
  const fill = spiritFill(points);
  const card = <SpiritStoneCard tower={tower} points={points} awake={awake} />;

  return (
    <div
      className="absolute z-20 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3"
      style={{ left: `${tower.x}%`, top: `${tower.y}%` }}
    >
      {tower.cardSide === "left" ? card : null}

      <button
        type="button"
        aria-label={`${tower.name}, ${points} of ${SPIRIT_UNLOCK}${awake ? ", awake" : ", still sleeping"}`}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        className="flex shrink-0 cursor-pointer flex-col items-center gap-1.5 outline-none"
      >
        <span
          className={cn(
            "relative flex h-[4.75rem] w-[4.75rem] items-center justify-center rounded-full p-[3px] transition duration-200",
            isSelected && "scale-110",
          )}
          style={{
            background: `conic-gradient(#ffc857 ${Math.round(fill * 360)}deg, rgba(255,255,255,0.12) 0deg)`,
          }}
        >
          <span
            className={cn(
              "relative h-full w-full overflow-hidden rounded-full border-2 bg-black",
              awake
                ? "border-[#ffc857] shadow-[0_0_22px_rgba(255,200,87,0.75)]"
                : "border-white/20",
            )}
          >
            <Image
              src={tower.image}
              alt=""
              fill
              sizes="80px"
              className={cn(
                tower.containImage ? "object-contain p-1" : "object-cover object-center",
                !awake && "grayscale brightness-50",
              )}
            />
            {!awake ? (
              <span className="absolute inset-0 flex items-center justify-center bg-black/35">
                <Lock className="h-4 w-4 text-white/80" />
              </span>
            ) : null}
          </span>
        </span>
        <span className="rounded-full border border-white/15 bg-[#07111f]/80 px-2.5 py-0.5 backdrop-blur-sm">
          <span className="block font-display text-[11px] tracking-[0.14em] text-[#f2f8ff] uppercase">
            {tower.name}
          </span>
        </span>
      </button>

      {tower.cardSide === "right" ? card : null}
    </div>
  );
}

function SpiritStoneCard({
  tower,
  points,
  awake,
}: {
  tower: TowerNode;
  points: number;
  awake: boolean;
}) {
  return (
    <article
      className="w-[168px] rounded-2xl border border-white/10 bg-[#07111f]/90 px-3 py-3 shadow-[0_12px_32px_rgba(7,17,31,0.45)] backdrop-blur-xl"
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <p className="font-display text-[9px] tracking-[0.2em] text-muted uppercase">
        {awake ? "Awake" : "Still sleeping"}
      </p>
      <div className="relative mt-2 h-16 w-full overflow-hidden rounded-xl bg-black">
        <Image
          src={tower.image}
          alt={tower.name}
          fill
          sizes="168px"
          className={tower.containImage ? "object-contain p-1.5" : "object-cover object-center"}
        />
      </div>
      <h2 className="mt-2 font-display text-sm tracking-wide text-text">{tower.name}</h2>
      <p className="mt-0.5 text-[11px] leading-4 text-muted">{tower.district}</p>
      <p className="mt-1.5 text-[11px] text-gold">
        {points} / {SPIRIT_UNLOCK}
      </p>
      <Link
        href="/vault"
        className="mt-2 inline-flex w-full items-center justify-center rounded-full border border-white/15 px-3 py-1.5 text-xs text-muted transition hover:border-cyan/40 hover:text-text"
      >
        Open vault
      </Link>
    </article>
  );
}
