function readPublishableKey() {
  return (
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() ||
    process.env.CLERK_PUBLISHABLE_KEY?.trim() ||
    ""
  );
}

/** True when a Clerk publishable key is present at build/runtime. */
export const isClerkConfigured = Boolean(readPublishableKey());

export function getClerkPublishableKey() {
  return readPublishableKey();
}
