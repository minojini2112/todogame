import { auth } from "@clerk/nextjs/server";
import { isClerkConfigured } from "@/lib/clerk";

/** Safe auth() for pages that should still render when Clerk isn't configured. */
export async function getOptionalUserId() {
  if (!isClerkConfigured) return null;
  const { userId } = await auth();
  return userId ?? null;
}
