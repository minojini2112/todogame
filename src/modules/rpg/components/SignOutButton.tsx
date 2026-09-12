"use client";

import { useClerk } from "@clerk/nextjs";

export function SignOutButton() {
  const { signOut } = useClerk();

  return (
    <button
      type="button"
      onClick={() => signOut({ redirectUrl: "/" })}
      className="rounded-full px-3 py-1.5 text-sm text-[var(--sanctum-muted)] transition hover:text-[var(--sanctum-ink)]"
    >
      Sign out
    </button>
  );
}
