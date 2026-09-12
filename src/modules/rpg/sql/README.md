SQL for the isolated Life RPG schema lives on the `todoGame` Supabase project.

Applied remote migrations:

1. `rpg_core_schema` — tables and enums
2. `rpg_engine_and_rls` — XP engine, streak, complete/create/buy RPCs
3. `rpg_rls_and_grants` / `rpg_harden_function_grants`
4. `rpg_clerk_identity_map` — profile/quest `user_id` is the Clerk `user_...` id
5. `rpg_clerk_engine_rls` — RPCs and RLS use `auth.jwt()->>'sub'`

Do not add city-map tables without the `rpg_` prefix into this module.
