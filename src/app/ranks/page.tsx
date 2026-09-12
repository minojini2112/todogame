import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { loadRpgState } from "@/modules/rpg/actions";

export const metadata: Metadata = {
  title: "Ranks",
  description: "Travelers ranked by cards unlocked and spirit score.",
};

export default async function RanksPage() {
  const state = await loadRpgState();

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#0a1624] text-[#f2f8ff]">
      <Image
        src="/aurelia/home-city.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-40"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(85,230,255,0.08),transparent_55%),linear-gradient(180deg,rgba(7,17,31,0.55),rgba(7,17,31,0.88))]" />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-4 py-6 sm:px-6">
        <header className="flex items-center justify-between gap-3">
          <div>
            <p className="font-display text-[10px] tracking-[0.28em] text-cyan uppercase">EchoBound</p>
            <h1 className="font-splash mt-1 text-3xl text-text">Ranks</h1>
            <p className="mt-1 text-sm text-muted">Cards unlocked, then spirit score.</p>
          </div>
          <Link
            href="/city"
            className="rounded-full border border-white/15 px-4 py-2 text-[11px] tracking-[0.18em] text-white/70 uppercase"
          >
            Map
          </Link>
        </header>

        <ol className="mt-8 space-y-2">
          {state.leaderboard.length === 0 ? (
            <li className="rounded-2xl border border-white/10 bg-void/50 px-4 py-3 text-sm text-muted">
              No travelers yet.
            </li>
          ) : (
            state.leaderboard.map((row) => {
              const you = row.user_id === state.profile.id;
              return (
                <li
                  key={row.user_id}
                  className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 backdrop-blur-md ${
                    you
                      ? "border-cyan/35 bg-[rgba(85,230,255,0.08)]"
                      : "border-white/10 bg-[rgba(7,17,31,0.55)]"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="font-display text-[11px] tracking-[0.2em] text-white/40 uppercase">
                      #{row.rank}
                      {you ? " · You" : ""}
                    </p>
                    <p className="mt-0.5 truncate text-sm text-text">{row.name}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs text-gold">{row.cards}/4 cards</p>
                    <p className="mt-0.5 text-[11px] text-muted">{row.points} score</p>
                  </div>
                </li>
              );
            })
          )}
        </ol>
      </div>
    </main>
  );
}
