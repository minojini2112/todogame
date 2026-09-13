"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import splashArt from "@/assests/splash_screen.jpeg";
import { SignOutButton } from "@/modules/rpg/components/SignOutButton";
import { SanctumSparkField } from "@/modules/rpg/components/SanctumSparkField";
import { xpForLevel } from "@/modules/rpg/engine";
import type { RpgProfile } from "@/modules/rpg/types";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type SanctumFrameProps = {
  profile: RpgProfile;
  current: "board" | "vault" | "city";
  children: ReactNode;
  onGuide?: () => void;
};

export function SanctumFrame({ profile, current, children, onGuide }: SanctumFrameProps) {
  const reduced = useReducedMotion();
  const need = xpForLevel(profile.level);
  const progress = Math.min(100, Math.round((profile.xp / Math.max(need, 1)) * 100));
  const [pulseXp, setPulseXp] = useState(false);
  const [chipTip, setChipTip] = useState<string | null>(null);

  return (
    <div className="sanctum relative min-h-dvh overflow-hidden">
      <Image
        src={splashArt}
        alt=""
        fill
        priority
        quality={90}
        sizes="100vw"
        className="object-cover object-[center_35%] scale-105"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(12,9,7,0.58) 0%, rgba(16,11,8,0.74) 40%, rgba(8,6,4,0.92) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen sanctum-motes"
      />
      <SanctumSparkField />

      <div className="relative z-10 flex min-h-dvh flex-col">
        <header className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <motion.p
              initial={reduced ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-splash text-[11px] tracking-[0.32em] text-[var(--sanctum-gold)] text-glow-gold"
            >
              EchoBound
            </motion.p>
            <p className="mt-1 truncate font-display text-sm tracking-wide text-[var(--sanctum-muted)]">
              {profile.display_name}
              <span className="mx-2 text-[var(--sanctum-gold)]/45">·</span>
              Level {profile.level}
            </p>
            <button
              type="button"
              aria-label="Echo XP"
              onClick={() => {
                setPulseXp(true);
                window.setTimeout(() => setPulseXp(false), 700);
              }}
              className="group mt-2 block w-[min(100%,220px)] text-left"
            >
              <div className="h-1.5 overflow-hidden rounded-full bg-black/35 transition group-hover:ring-1 group-hover:ring-[var(--sanctum-gold)]/40">
                <motion.div
                  className="relative h-full overflow-hidden rounded-full bg-[linear-gradient(90deg,var(--sanctum-ember),var(--sanctum-gold))] shadow-[0_0_12px_rgba(228,180,92,0.55)]"
                  initial={reduced ? false : { width: 0 }}
                  animate={{
                    width: `${progress}%`,
                    scaleY: pulseXp ? [1, 1.35, 1] : 1,
                  }}
                  transition={{ duration: reduced ? 0 : 0.9, ease: "easeOut" }}
                >
                  {!reduced ? (
                    <span className="pointer-events-none absolute inset-y-0 w-1/3 skew-x-[-20deg] bg-white/35 animate-shimmer" />
                  ) : null}
                </motion.div>
              </div>
              <p className="mt-1 text-[10px] tracking-[0.16em] text-[var(--sanctum-muted)] uppercase transition group-hover:text-[var(--sanctum-gold)]">
                {profile.xp} / {need} XP
              </p>
            </button>
          </div>

          <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
            <EchoSeal reduced={reduced} />
            <nav aria-label="App" className="flex flex-wrap items-center justify-end gap-1 sm:gap-2">
              {onGuide ? (
                <motion.button
                  type="button"
                  data-tour="tour-guide-btn"
                  onClick={onGuide}
                  whileHover={reduced ? undefined : { scale: 1.04 }}
                  whileTap={reduced ? undefined : { scale: 0.96 }}
                  className="rounded-full border border-[rgba(228,180,92,0.4)] px-3.5 py-1.5 font-display text-xs tracking-[0.14em] text-[var(--sanctum-gold)] uppercase transition hover:bg-[rgba(228,180,92,0.14)] hover:shadow-[0_0_16px_rgba(228,180,92,0.25)]"
                >
                  Guide
                </motion.button>
              ) : null}
              <NavLink href="/board" active={current === "board"}>
                Quests
              </NavLink>
              <NavLink href="/vault" active={current === "vault"}>
                Vault
              </NavLink>
              <NavLink href="/city" active={current === "city"}>
                Map
              </NavLink>
              <SignOutButton />
            </nav>
          </div>
        </header>

        <div className="relative flex flex-wrap items-center gap-3 px-4 pb-3 sm:px-6">
          <StatChip
            label="Shards"
            value={String(profile.shards)}
            tip="City fragments earned from quests"
            onTip={setChipTip}
          />
          <StatChip
            label="Streak"
            value={`${profile.streak_count} day${profile.streak_count === 1 ? "" : "s"}`}
            tip="Consecutive days you completed a quest"
            onTip={setChipTip}
          />
          <p className="hidden text-xs text-[var(--sanctum-muted)] sm:inline">
            Complete quests to earn XP and grow your Echo.
          </p>
          <AnimatePresence>
            {chipTip ? (
              <motion.p
                key={chipTip}
                initial={reduced ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="w-full text-xs text-[var(--sanctum-gold)] sm:w-auto"
              >
                {chipTip}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="flex-1 px-3 pb-8 sm:px-5">{children}</div>
      </div>
    </div>
  );
}

function EchoSeal({ reduced }: { reduced: boolean }) {
  const [spin, setSpin] = useState(0);

  return (
    <motion.button
      type="button"
      aria-label="Echo seal"
      title="Tap the seal"
      onClick={() => setSpin((value) => value + 1)}
      whileHover={reduced ? undefined : { scale: 1.06 }}
      whileTap={reduced ? undefined : { scale: 0.94 }}
      className="relative hidden size-11 items-center justify-center rounded-full border border-[rgba(228,180,92,0.45)] bg-[rgba(16,11,8,0.65)] shadow-[0_0_20px_rgba(228,180,92,0.2)] backdrop-blur-md sm:flex"
    >
      <motion.span
        key={spin}
        className="font-splash text-lg text-[var(--sanctum-gold)]"
        initial={reduced ? false : { rotate: 0, scale: 0.9 }}
        animate={{ rotate: 360, scale: 1 }}
        transition={{ duration: reduced ? 0 : 0.7, ease: "easeOut" }}
      >
        ✦
      </motion.span>
      {!reduced ? (
        <span className="pointer-events-none absolute inset-0 rounded-full border border-[var(--sanctum-gold)]/30 animate-pulse-ring" />
      ) : null}
    </motion.button>
  );
}

function StatChip({
  label,
  value,
  tip,
  onTip,
}: {
  label: string;
  value: string;
  tip: string;
  onTip: (value: string | null) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        onTip(tip);
        window.setTimeout(() => onTip(null), 2200);
      }}
      className="sanctum-chip inline-flex items-center gap-2 rounded-full border border-[rgba(232,196,140,0.22)] bg-black/25 px-3 py-1.5 backdrop-blur-md transition hover:-translate-y-0.5 hover:border-[rgba(228,180,92,0.55)] hover:shadow-[0_0_16px_rgba(228,180,92,0.2)]"
    >
      <span className="font-display text-[9px] tracking-[0.2em] text-[var(--sanctum-gold)] uppercase">
        {label}
      </span>
      <span className="text-xs text-[var(--sanctum-ink)]">{value}</span>
    </button>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      data-sfx="click"
      className={
        active
          ? "rounded-full bg-[var(--sanctum-gold)] px-3.5 py-1.5 font-display text-xs tracking-[0.14em] text-[#1a1208] uppercase shadow-[0_0_22px_rgba(228,180,92,0.35)] transition hover:brightness-110"
          : "rounded-full px-3.5 py-1.5 font-display text-xs tracking-[0.14em] text-[var(--sanctum-muted)] uppercase transition hover:-translate-y-0.5 hover:bg-white/5 hover:text-[var(--sanctum-ink)]"
      }
    >
      {children}
    </Link>
  );
}
