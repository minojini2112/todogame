"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import { useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { GlowBadge } from "@/components/ui/GlowBadge";
import { isClerkConfigured } from "@/lib/clerk";
import { clerkAppearance } from "@/modules/rpg/clerk/appearance";

export function AwakenForm() {
  const [mode, setMode] = useState<"bind" | "return">("bind");

  if (!isClerkConfigured) {
    return (
      <GlassPanel glow="gold" className="w-full max-w-lg p-6 sm:p-8">
        <p className="font-display text-[11px] tracking-[0.32em] text-cure uppercase">
          Architect Protocol
        </p>
        <h1 className="mt-2 font-display text-3xl tracking-[0.12em] uppercase">
          Signal offline
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Clerk keys are missing in this environment, so binding is unavailable. Add
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and redeploy.
        </p>
      </GlassPanel>
    );
  }

  return (
    <GlassPanel glow="gold" className="w-full max-w-lg p-6 sm:p-8">
      <p className="font-display text-[11px] tracking-[0.32em] text-cure uppercase">
        Architect Protocol
      </p>
      <h1 className="mt-2 font-display text-3xl tracking-[0.12em] uppercase">
        {mode === "bind" ? "Bind your signal" : "Return to Aurelia"}
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        {mode === "bind"
          ? "Clerk maps you to the last city. Your quests, XP, and vault stay bound to this traveler across devices."
          : "Welcome back. Your board and streak wait on the far side of this door."}
      </p>

      <div className="mt-5 flex gap-2" role="tablist" aria-label="Bind or return">
        <ModeTab active={mode === "bind"} onClick={() => setMode("bind")}>
          New traveler
        </ModeTab>
        <ModeTab active={mode === "return"} onClick={() => setMode("return")}>
          Returning
        </ModeTab>
      </div>

      <div className="mt-6 flex justify-center">
        {mode === "return" ? (
          <SignIn
            routing="hash"
            fallbackRedirectUrl="/board"
            forceRedirectUrl="/board"
            appearance={clerkAppearance}
          />
        ) : (
          <SignUp
            routing="hash"
            fallbackRedirectUrl="/board"
            forceRedirectUrl="/board"
            appearance={clerkAppearance}
          />
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <GlowBadge>Clerk session</GlowBadge>
        <GlowBadge tone="gold">Server-side XP</GlowBadge>
        <GlowBadge tone="violet">Your quests only</GlowBadge>
      </div>
    </GlassPanel>
  );
}

function ModeTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={
        active
          ? "rounded-full bg-cure px-4 py-2 font-display text-xs tracking-[0.16em] text-void uppercase"
          : "rounded-full border border-white/15 px-4 py-2 font-display text-xs tracking-[0.16em] text-muted uppercase"
      }
    >
      {children}
    </button>
  );
}
