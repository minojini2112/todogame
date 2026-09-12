"use client";

import { useClerk } from "@clerk/nextjs";

export function SignOutButton() {
  const { signOut } = useClerk();

  return (
    <button
      type="button"
      onClick={() => signOut({ redirectUrl: "/" })}
      className="rounded-full px-3.5 py-1.5 font-display text-xs tracking-[0.14em] text-[var(--sanctum-muted)] uppercase transition hover:bg-white/5 hover:text-[#f0a07a]"
    >
      Sign out
    </button>
  );
}
