"use client";

import { useClerk } from "@clerk/nextjs";
import { useState } from "react";
import { SeverBondConfirm } from "@/components/SeverBondConfirm";
import { cn } from "@/lib/utils";

export function SignOutButton({
  tone = "sanctum",
  className,
}: {
  tone?: "city" | "sanctum";
  className?: string;
}) {
  const { signOut } = useClerk();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function disconnect() {
    if (busy) return;
    setBusy(true);
    try {
      await signOut({ redirectUrl: "/" });
    } catch {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "rounded-full px-3.5 py-1.5 font-display text-[11px] tracking-[0.16em] uppercase transition sm:px-4",
          tone === "city"
            ? "text-muted hover:bg-white/5 hover:text-signal"
            : "text-[var(--sanctum-muted)] hover:bg-white/5 hover:text-[#f0a07a]",
          className,
        )}
      >
        Sever Bond
      </button>
      <SeverBondConfirm
        open={open}
        busy={busy}
        tone={tone}
        onStay={() => {
          if (!busy) setOpen(false);
        }}
        onDisconnect={() => void disconnect()}
      />
    </>
  );
}
