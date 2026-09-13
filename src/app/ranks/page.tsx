import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { loadRpgState } from "@/modules/rpg/actions";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Echo Chorus",
  description: "Who walks brightest among the spirits of Aurelia.",
  robots: { index: false, follow: false },
};

export default async function RanksPage() {
  const state = await loadRpgState();
  const youId = state.profile.id;

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#0a1624] text-[#f2f8ff]">
      <Image
        src="/aurelia/home-city.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-45"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(85,230,255,0.14),transparent_50%),radial-gradient(ellipse_at_80%_100%,rgba(157,123,255,0.12),transparent_45%),linear-gradient(180deg,rgba(7,17,31,0.5),rgba(7,17,31,0.92))]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 sanctum-motes opacity-30 mix-blend-screen" />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-4 py-6 sm:px-6">
        <header className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-display text-[10px] tracking-[0.3em] text-heartlight uppercase">
              Aurelia listens
            </p>
            <h1 className="font-splash mt-1 text-4xl text-text text-glow-cyan sm:text-5xl">
              Echo Chorus
            </h1>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted">
              Who walks brightest among the spirits tonight — ranked by spirits woken, then by
              echo strength.
            </p>
          </div>
          <Link
            href="/city"
            className="shrink-0 rounded-full border border-heartlight/30 bg-heartlight/10 px-4 py-2 font-display text-[11px] tracking-[0.18em] text-heartlight uppercase transition hover:border-heartlight/55 hover:bg-heartlight/15 hover:shadow-[0_0_20px_rgba(85,230,255,0.2)]"
          >
            Return to map
          </Link>
        </header>

        <section
          aria-label="Full echo chorus"
          className="relative mt-8 overflow-hidden rounded-[28px] border border-heartlight/20 bg-[#07111f]/88 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_40px_rgba(85,230,255,0.08)] backdrop-blur-xl sm:p-5"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(85,230,255,0.14),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(157,123,255,0.1),transparent_55%)]"
          />
          <div aria-hidden className="pointer-events-none absolute inset-0 sanctum-motes opacity-20 mix-blend-screen" />

          <div className="relative mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="font-display text-[9px] tracking-[0.28em] text-gold uppercase">
                Living ledger
              </p>
              <p className="mt-1 text-xs text-muted">
                {state.leaderboard.length === 0
                  ? "The chorus is still quiet."
                  : `${state.leaderboard.length} traveler${state.leaderboard.length === 1 ? "" : "s"} bound to the city.`}
              </p>
            </div>
            <Link
              href="/board"
              className="font-display text-[9px] tracking-[0.16em] text-muted uppercase transition hover:text-heartlight"
            >
              Quests →
            </Link>
          </div>

          <ol className="relative space-y-2.5">
            {state.leaderboard.length === 0 ? (
              <li className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-sm text-muted">
                No echoes yet. Wake spirits on the map, and the chorus will remember your name.
              </li>
            ) : (
              state.leaderboard.map((row) => {
                const you = row.user_id === youId;
                return (
                  <li
                    key={row.user_id}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-2xl border px-3.5 py-3 backdrop-blur-md transition sm:px-4",
                      you
                        ? "border-heartlight/40 bg-[linear-gradient(135deg,rgba(85,230,255,0.14),rgba(157,123,255,0.08))] shadow-[inset_0_0_24px_rgba(85,230,255,0.08),0_0_20px_rgba(85,230,255,0.08)]"
                        : "border-white/10 bg-black/30 hover:border-white/18",
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={cn(
                          "flex h-10 min-w-10 items-center justify-center rounded-full border font-display text-sm tracking-wide",
                          you
                            ? "border-heartlight/50 bg-heartlight/15 text-heartlight shadow-[0_0_16px_rgba(85,230,255,0.3)]"
                            : row.rank <= 3
                              ? "border-gold/40 bg-gold/10 text-gold"
                              : "border-white/15 bg-white/5 text-muted",
                        )}
                      >
                        {row.rank}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm text-text sm:text-[15px]">
                          {row.name}
                          {you ? (
                            <span className="ml-2 font-display text-[9px] tracking-[0.16em] text-heartlight uppercase">
                              Bound
                            </span>
                          ) : null}
                        </p>
                        <p className="mt-0.5 font-display text-[9px] tracking-[0.18em] text-muted uppercase">
                          {you ? "Your signal" : row.rank === 1 ? "Brightest echo" : "Traveler"}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs text-gold">
                        {row.cards}/4 spirits
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted">{row.points} echo</p>
                    </div>
                  </li>
                );
              })
            )}
          </ol>
        </section>

        <p className="relative mt-6 text-center text-[11px] leading-5 text-muted">
          Spirits woken first. Echo strength breaks the tie. Aurelia keeps the chorus.
        </p>
      </div>
    </main>
  );
}
