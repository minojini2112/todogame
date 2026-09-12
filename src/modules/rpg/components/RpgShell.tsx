import type { ReactNode } from "react";
import Link from "next/link";
import { GameHUD } from "@/components/game/GameHUD";
import { xpForLevel } from "@/modules/rpg/engine";
import { SignOutButton } from "@/modules/rpg/components/SignOutButton";
import type { RpgProfile } from "@/modules/rpg/types";

type RpgShellProps = {
  profile: RpgProfile;
  children: ReactNode;
  current: "board" | "vault";
};

export function RpgShell({ profile, children, current }: RpgShellProps) {
  return (
    <div className="bg-world-grid min-h-dvh">
      <GameHUD
        level={profile.level}
        xp={profile.xp}
        xpRequired={xpForLevel(profile.level)}
        shards={profile.shards}
        streak={profile.streak_count}
        location={profile.display_name}
        day={Math.max(1, profile.streak_count)}
      />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-16 pt-28 sm:px-6">
        <nav
          aria-label="Sanctum"
          className="flex flex-wrap items-center justify-between gap-3"
        >
          <div className="flex flex-wrap gap-2">
            <NavChip href="/board" active={current === "board"}>
              Quest Board
            </NavChip>
            <NavChip href="/vault" active={current === "vault"}>
              Relic Vault
            </NavChip>
            <NavChip href="/city" active={false}>
              Aurelia Map
            </NavChip>
          </div>
          <SignOutButton />
        </nav>
        {children}
      </div>
    </div>
  );
}

function NavChip({
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
          ? "rounded-full bg-heartlight px-4 py-2 font-display text-xs tracking-[0.16em] text-void uppercase"
          : "rounded-full border border-white/15 px-4 py-2 font-display text-xs tracking-[0.16em] text-muted uppercase transition hover:border-heartlight/40 hover:text-ink"
      }
    >
      {children}
    </Link>
  );
}
