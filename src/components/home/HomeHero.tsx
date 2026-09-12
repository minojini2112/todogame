"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useCallback, type PointerEvent } from "react";

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${6 + ((i * 17) % 88)}%`,
  top: `${12 + ((i * 29) % 70)}%`,
  size: 1.5 + (i % 4) * 0.7,
  delay: (i % 9) * 0.35,
  duration: 4.5 + (i % 5) * 1.1,
}));

export default function HomeHero() {
  const reduceMotion = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 60, damping: 22, mass: 0.6 });
  const y = useSpring(rawY, { stiffness: 60, damping: 22, mass: 0.6 });

  const bgX = useTransform(x, (v) => v * 8);
  const bgY = useTransform(y, (v) => v * 6);
  const mistX = useTransform(x, (v) => v * -14);
  const mistY = useTransform(y, (v) => v * -10);
  const uiX = useTransform(x, (v) => v * 10);
  const glowX = useTransform(x, (v) => `${50 + v * 18}%`);
  const glowY = useTransform(y, (v) => `${42 + v * 14}%`);
  const glow = useMotionTemplate`radial-gradient(520px circle at ${glowX} ${glowY}, rgba(85, 230, 255, 0.14), transparent 55%)`;

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (reduceMotion) return;
      const { innerWidth, innerHeight } = window;
      rawX.set((event.clientX / innerWidth - 0.5) * 2);
      rawY.set((event.clientY / innerHeight - 0.5) * 2);
    },
    [rawX, rawY, reduceMotion],
  );

  const onPointerLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return (
    <main
      className="relative h-dvh min-h-[640px] overflow-hidden bg-void"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {/* City plane */}
      <motion.div
        className="absolute inset-[-4%] will-change-transform"
        style={
          reduceMotion
            ? undefined
            : { x: bgX, y: bgY }
        }
        animate={
          reduceMotion
            ? undefined
            : {
                scale: [1.02, 1.06, 1.02],
              }
        }
        transition={
          reduceMotion
            ? undefined
            : { duration: 28, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <Image
          src="/aurelia/home-city.png"
          alt="Aurelia — a golden city of bridges and waterfalls above the clouds"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/* Atmospheric washes — keep sky/city visible, darken only the title zone */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(7,17,31,0.28) 0%, rgba(7,17,31,0.05) 28%, rgba(7,17,31,0.0) 45%, rgba(7,17,31,0.35) 68%, rgba(7,17,31,0.88) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 50% at 50% 72%, rgba(7,17,31,0.55) 0%, transparent 70%)",
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={reduceMotion ? undefined : { background: glow }}
      />

      {/* Drifting mist veil */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={
          reduceMotion
            ? {
                background:
                  "radial-gradient(ellipse 80% 40% at 50% 78%, rgba(242,248,255,0.18), transparent 70%)",
              }
            : {
                x: mistX,
                y: mistY,
                background:
                  "radial-gradient(ellipse 80% 40% at 50% 78%, rgba(242,248,255,0.22), transparent 70%)",
              }
        }
        animate={
          reduceMotion
            ? undefined
            : { opacity: [0.35, 0.55, 0.35] }
        }
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Dust motes */}
      {!reduceMotion && (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {PARTICLES.map((p) => (
            <motion.span
              key={p.id}
              className="absolute rounded-full bg-cyan/80"
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                boxShadow: "0 0 8px rgba(85,230,255,0.7)",
              }}
              animate={{
                y: [0, -28, 0],
                opacity: [0.15, 0.85, 0.15],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Soft scanline texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.35) 3px)",
        }}
      />

      {/* Top brand strip — minimal, not competing with hero brand */}
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-5 sm:px-8">
        <p className="font-display text-[11px] tracking-[0.35em] text-text/70 uppercase">
          Signal Online
        </p>
        <Link
          href="/city"
          className="rounded-full border border-text/15 bg-void/35 px-3.5 py-1.5 text-xs tracking-wide text-muted backdrop-blur-md transition hover:border-cyan/40 hover:text-text"
        >
          Enter city map
        </Link>
      </header>

      {/* Hero copy — locked to lower third so city stays hero and CTAs stay in-view */}
      <motion.div
        className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center px-5 pb-8 pt-24 text-center sm:px-8 sm:pb-10"
        style={reduceMotion ? undefined : { x: uiX }}
      >
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="w-full max-w-2xl"
        >
          <p className="mb-3 font-display text-[10px] tracking-[0.42em] text-cyan uppercase sm:text-[11px]">
            Architect Protocol · Aurelia
          </p>

          <h1 className="font-display text-[clamp(2.4rem,7vw,5.25rem)] leading-[0.95] font-bold tracking-[0.08em] text-text drop-shadow-[0_10px_36px_rgba(7,17,31,0.9)]">
            ECHOBOUND
          </h1>

          <p className="mt-2 font-display text-[clamp(0.85rem,1.8vw,1.2rem)] tracking-[0.28em] text-gold uppercase">
            The Last City
          </p>

          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted sm:mt-5 sm:text-base">
            Aurelia still stands above the clouds — but the Heartlight is dying.
            Your real-world quests are the signal that can restore it.
          </p>

          <div className="mt-7 flex flex-col items-center gap-3 sm:mt-8 sm:flex-row sm:justify-center sm:gap-4">
            <motion.div
              whileHover={reduceMotion ? undefined : { scale: 1.03 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            >
              <Link
                href="/city"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full px-8 py-3.5 font-display text-sm tracking-[0.22em] text-void uppercase shadow-[0_0_32px_rgba(85,230,255,0.35)]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-cyan via-[#9af3ff] to-cyan" />
                {!reduceMotion && (
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 bg-white/25"
                    animate={{ opacity: [0.05, 0.35, 0.05] }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}
                <span className="relative">Enter Aurelia</span>
              </Link>
            </motion.div>

            <Link
              href="/city"
              className="rounded-full border border-text/25 bg-void/45 px-6 py-3 text-sm tracking-wide text-text/90 backdrop-blur-md transition hover:border-gold/50 hover:text-gold"
            >
              Open city map
            </Link>
          </div>

          <motion.div
            aria-hidden
            className="mx-auto mt-8 h-px w-36 bg-gradient-to-r from-transparent via-cyan/70 to-transparent"
            initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          />
          <p className="mt-3 font-display text-[10px] tracking-[0.35em] text-muted/80 uppercase">
            Six Cure Keys · One City · Your Quests
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}
