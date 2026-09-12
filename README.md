# EchoBound

A Life RPG. Real-world tasks become quests that restore Aurelia. Completing a rite awards XP, aether shards, attribute growth, and a streak — calculated on the server so stats cannot be forged in the browser.

## Stack

- Next.js 16 (App Router) + React 19
- Tailwind CSS 4 + Framer Motion
- Clerk for signup / login / session
- Supabase Postgres (project **todoGame**) for quests and stats
- Server-only progression RPCs keyed to the Clerk user id

## Module ownership (avoid merge conflicts)

| Area | Paths | Owner |
| --- | --- | --- |
| Life RPG / todos | `src/modules/rpg/**`, `/board`, `/vault` | This slice |
| City map | `src/components/city/**`, `src/store/cityMapStore.ts`, `src/lib/city/**`, `/city` | Teammates |

Database objects for this slice are prefixed `rpg_`.

## Setup

```bash
npm install
cp .env.example .env.local
```

Fill `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/city
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/city
```

Connect Clerk to Supabase so todos stay scoped to the signed-in traveler:

1. Clerk Dashboard → [Supabase integration](https://dashboard.clerk.com) → Activate. Copy the Clerk domain.
2. Supabase **todoGame** → Authentication → Sign in / Providers → Add provider → **Clerk**. Paste that domain.
3. Add `pk_` / `sk_` keys to `.env.local`.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Player loop

1. Splash → **Start Journey** → bind (signup) or return (login).
2. **Quest Board** — create, rewrite, unbind, or complete rites.
3. Completing a rite is a Postgres function (`rpg_complete_quest`): XP curve, shards, attribute, streak, activity log.
4. **Relic Vault** — spend shards on badges/themes; review the signal log.
5. Refresh the page: data is in Supabase, not `localStorage`.

Level curve (matches SQL `rpg_xp_for_level`):

```
max(80, floor(80 * level^1.55))
```

Each level costs more than the last.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Deploy

Host the Next app (Vercel or similar). Set the same env vars. Point Supabase Site URL and redirects at the live origin.
