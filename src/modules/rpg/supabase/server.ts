import { createClient } from "@supabase/supabase-js";
import { getSupabaseBrowserEnv } from "@/modules/rpg/supabase/env";

/** Anon client only. Identity is Clerk; writes go through secret-gated RPCs. */
export function createServerSupabase() {
  const { url, key } = getSupabaseBrowserEnv();
  return createClient(url, key);
}

export function rpgBridge() {
  const secret = process.env.RPG_SERVER_SECRET;
  if (!secret) {
    throw new Error("Missing RPG_SERVER_SECRET");
  }
  return secret;
}
