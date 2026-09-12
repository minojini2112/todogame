"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState, type MouseEvent, type PointerEvent } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";
import { startPrologueMusic } from "@/lib/prologue/audio";

const ORBITS = [
  { delay: 0, radius: 78, size: 6, duration: 7 },
  { delay: 1.2, radius: 86, size: 4, duration: 9 },
  { delay: 2.4, radius: 72, size: 5, duration: 6 },
];

type Burst = {
  id: number;
  x: number;
  y: number;
};

type AwakenButtonProps = {
  href?: string;
};

export function AwakenButton({ href = "/intro" }: AwakenButtonProps) {
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [bursts, setBursts] = useState<Burst[]>([]);

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    if (reduced) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    setTilt({
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 12,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * 8,
    });
  }

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    startPrologueMusic();

    if (reduced) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const burst = {
      id: Date.now(),
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    setBursts((current) => [...current, burst]);
    window.setTimeout(() => {
      setBursts((current) => current.filter((item) => item.id !== burst.id));
    }, 650);
  }

  return (
    <motion.div
      className="relative"
      initial={reduced ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 22, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: reduced ? 0.2 : 0.7, ease: "easeOut" }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => {
        setHovered(false);
        setTilt({ x: 0, y: 0 });
      }}
      onPointerMove={handleMove}
    >
      {!reduced
        ? ORBITS.map((orbit) => (
            <motion.span
              key={orbit.delay}
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]"
              style={{ width: orbit.size, height: orbit.size, marginLeft: -orbit.size / 2, marginTop: -orbit.size / 2 }}
              animate={{
                x: [0, orbit.radius, 0, -orbit.radius, 0],
                y: [ -orbit.radius * 0.35, 0, orbit.radius * 0.35, 0, -orbit.radius * 0.35],
                opacity: hovered ? [0.4, 1, 0.4] : [0.15, 0.55, 0.15],
              }}
              transition={{
                duration: hovered ? orbit.duration * 0.55 : orbit.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: orbit.delay,
              }}
            />
          ))
        : null}

      {!reduced ? (
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -inset-3 rounded-full border border-cure/40",
            hovered ? "animate-pulse-ring-fast" : "animate-pulse-ring",
          )}
        />
      ) : null}

      <motion.div
        className="relative"
        animate={
          reduced
            ? undefined
            : {
                rotateX: -tilt.y,
                rotateY: tilt.x,
                y: hovered ? -4 : 0,
                scale: hovered ? 1.04 : 1,
              }
        }
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <Link
          href={href}
          onClick={handleClick}
          className={cn(
            "group relative inline-flex min-h-14 items-center justify-center overflow-hidden rounded-full px-10 py-4 sm:min-h-16 sm:px-12",
            "border border-[#ffe7a3] bg-[#ffc857] text-[#07111f]",
            "font-splash text-base font-semibold tracking-[0.14em] uppercase sm:text-lg",
            "shadow-[0_12px_40px_rgba(7,17,31,0.45),0_0_36px_rgba(255,200,87,0.4),inset_0_1px_0_rgba(255,255,255,0.55)]",
            "transition-colors duration-300 hover:bg-[#ffd57a] hover:border-white",
            "focus-visible:outline-offset-4",
          )}
        >
          <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.5),transparent_58%)]" />
          <span
            className={cn(
              "pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 skew-x-[-24deg] bg-white/45",
              reduced ? "hidden" : "animate-shimmer",
            )}
          />

          <motion.span
            aria-hidden="true"
            className="relative mr-3 text-[#7a4b00]"
            animate={
              reduced
                ? undefined
                : hovered
                  ? { rotate: [0, 18, -8, 0], scale: 1.2 }
                  : { rotate: 0, scale: 1 }
            }
            transition={{ duration: 0.55 }}
          >
            ✦
          </motion.span>

          <span className="relative">Start Journey</span>

          <motion.span
            aria-hidden="true"
            className="relative ml-3 inline-flex"
            animate={reduced ? undefined : { x: hovered ? 6 : 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 20 }}
          >
            <ArrowRight className="size-5" />
          </motion.span>

          <AnimatePresence>
            {bursts.map((burst) => (
              <motion.span
                key={burst.id}
                aria-hidden="true"
                className="pointer-events-none absolute size-8 rounded-full border-2 border-white/80"
                style={{ left: burst.x - 16, top: burst.y - 16 }}
                initial={{ opacity: 0.8, scale: 0.2 }}
                animate={{ opacity: 0, scale: 3.2 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            ))}
          </AnimatePresence>
        </Link>
      </motion.div>
    </motion.div>
  );
}
