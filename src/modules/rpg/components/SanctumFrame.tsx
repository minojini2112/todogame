import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import splashArt from "@/assests/splash_screen.jpeg";
import { SignOutButton } from "@/modules/rpg/components/SignOutButton";
import { xpForLevel } from "@/modules/rpg/engine";
import type { RpgProfile } from "@/modules/rpg/types";

type SanctumFrameProps = {
  profile: RpgProfile;
  current: "board" | "vault";
  children: ReactNode;
};

export function SanctumFrame({ profile, current, children }: SanctumFrameProps) {
  const need = xpForLevel(profile.level);

  return (
    <div className="sanctum relative min-h-dvh overflow-hidden">
      <Image
        src={splashArt}
        alt=""
        fill
        priority
        quality={90}
        sizes="100vw"
        className="object-cover object-[center_35%]"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(12,9,7,0.55) 0%, rgba(16,11,8,0.72) 38%, rgba(10,8,6,0.88) 100%)",
        }}
      />

      <div className="relative z-10 flex min-h-dvh flex-col">
        <header className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="font-splash text-[11px] tracking-[0.28em] text-[var(--sanctum-gold)]">
              EchoBound
            </p>
            <p className="truncate text-sm text-[var(--sanctum-muted)]">
              {profile.display_name}
              <span className="mx-2 text-[var(--sanctum-gold)]/50">·</span>
              Level {profile.level}
              <span className="mx-2 text-[var(--sanctum-gold)]/50">·</span>
              {profile.xp}/{need} XP
            </p>
          </div>

          <nav aria-label="App" className="flex flex-wrap items-center gap-1 sm:gap-2">
            <NavLink href="/board" active={current === "board"}>
              Tasks
            </NavLink>
            <NavLink href="/vault" active={current === "vault"}>
              Vault
            </NavLink>
            <NavLink href="/city" active={false}>
              Map
            </NavLink>
            <SignOutButton />
          </nav>
        </header>

        <div className="flex items-center gap-4 px-4 pb-3 text-xs text-[var(--sanctum-muted)] sm:px-6">
          <span>{profile.shards} shards</span>
          <span>{profile.streak_count} day streak</span>
          <span className="hidden sm:inline">Complete tasks to earn XP</span>
        </div>

        <div className="flex-1 px-3 pb-8 sm:px-5">{children}</div>
      </div>
    </div>
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
      className={
        active
          ? "rounded-full bg-[var(--sanctum-gold)] px-3 py-1.5 text-sm text-[#1a1208]"
          : "rounded-full px-3 py-1.5 text-sm text-[var(--sanctum-muted)] transition hover:text-[var(--sanctum-ink)]"
      }
    >
      {children}
    </Link>
  );
}
