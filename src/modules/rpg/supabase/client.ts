import { createClient } from "@supabase/supabase-js";
import { getSupabaseBrowserEnv } from "@/modules/rpg/supabase/env";

export function createBrowserSupabase(getToken: () => Promise<string | null>) {
  const { url, key } = getSupabaseBrowserEnv();

  return createClient(url, key, {
    async accessToken() {
      return getToken();
    },
  });
}
