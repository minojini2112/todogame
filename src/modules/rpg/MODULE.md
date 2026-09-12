# EchoBound Life RPG module

This folder and the routes `/awaken`, `/board`, `/vault` are the **Life RPG / quest** slice.

Identity is **Clerk** (`user_...`). Every quest row stores that id in `user_id`. Supabase RLS and RPCs read `auth.jwt()->>'sub'` from the Clerk session token, so travelers never see each other's todos.

Teammates working on the city map (`/city`, `src/components/city`, `src/store/cityMapStore.ts`, `src/lib/city`) should treat this module as owned elsewhere. All database objects are prefixed `rpg_` so map tables can be added without collisions.

Writes to XP, shards, streaks, attributes, and inventory happen only through Postgres RPCs (`rpg_complete_quest`, `rpg_create_quest`, `rpg_buy_item`). Clients cannot update those columns directly.
