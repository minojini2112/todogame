"use client";

import { useState } from "react";
import { SkipForward, Volume2, VolumeX } from "lucide-react";
import { AttributeBar } from "@/components/game/AttributeBar";
import { GameHUD } from "@/components/game/GameHUD";
import { RewardPopup } from "@/components/game/RewardPopup";
import { GameButton } from "@/components/ui/GameButton";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { GlowBadge } from "@/components/ui/GlowBadge";
import { IconButton } from "@/components/ui/IconButton";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { QuestCard } from "@/components/ui/QuestCard";
import { XPBar } from "@/components/ui/XPBar";

export function KitShowcase() {
  const [muted, setMuted] = useState(true);
  const [rewardOpen, setRewardOpen] = useState(false);

  return (
    <div className="bg-world-grid min-h-full">
      <GameHUD
        level={7}
        xp={2480}
        xpRequired={3162}
        shards={320}
        streak={7}
        location="Aurelia"
        day={17}
      />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-20 pt-28 sm:px-6">
        <section className="max-w-2xl">
          <p className="font-display text-xs tracking-[0.32em] text-heartlight">
            Milestone 1
          </p>
          <h1 className="mt-3 font-display text-4xl uppercase tracking-[0.14em] sm:text-5xl">
            EchoBound UI Kit
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted">
            Reusable HUD pieces for the Life RPG. These are real components, not a
            flattened mockup: glass panels, mission cards, and reward language that
            can sit over the world later.
          </p>
        </section>

        <section className="grid gap-4">
          <SectionTitle>Actions</SectionTitle>
          <GlassPanel className="flex flex-wrap items-center gap-3 p-5">
            <GameButton>Begin Focus</GameButton>
            <GameButton variant="secondary">View City</GameButton>
            <GameButton variant="ghost">Skip Story</GameButton>
            <GameButton variant="gold" onClick={() => setRewardOpen(true)}>
              Claim Reward
            </GameButton>
            <IconButton
              label={muted ? "Unmute audio" : "Mute audio"}
              onClick={() => setMuted((value) => !value)}
            >
              {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </IconButton>
            <IconButton label="Skip intro">
              <SkipForward className="size-4" />
            </IconButton>
          </GlassPanel>
        </section>

        <section className="grid gap-4">
          <SectionTitle>Status</SectionTitle>
          <div className="grid gap-4 md:grid-cols-2">
            <GlassPanel className="flex flex-col gap-5 p-6">
              <div className="flex flex-wrap gap-2">
                <GlowBadge>Live Signal</GlowBadge>
                <GlowBadge tone="gold">Cure Key</GlowBadge>
                <GlowBadge tone="green">Restored</GlowBadge>
                <GlowBadge tone="violet">Skyform</GlowBadge>
                <GlowBadge tone="coral">City Damage</GlowBadge>
              </div>
              <XPBar current={2480} required={3162} level={7} />
              <ProgressBar label="Academy restoration" value={72} tone="cyan" />
              <ProgressBar label="Power Grid" value={45} tone="violet" />
              <ProgressBar label="Healing Gardens" value={31} tone="green" />
            </GlassPanel>

            <GlassPanel className="flex flex-col gap-5 p-6">
              <h2 className="font-display text-sm uppercase tracking-[0.2em] text-muted">
                Attributes
              </h2>
              <AttributeBar name="focus" value={12} />
              <AttributeBar name="endurance" value={8} />
              <AttributeBar name="recovery" value={6} />
              <AttributeBar name="creativity" value={9} />
              <AttributeBar name="resolve" value={11} />
            </GlassPanel>
          </div>
        </section>

        <section className="grid gap-4">
          <SectionTitle>Quest Cards</SectionTitle>
          <div className="grid gap-4 lg:grid-cols-2">
            <QuestCard
              title="The First Signal"
              description="Solve one DSA problem and return the fragment to the Academy."
              category="focus"
              difficulty="guardian"
              district="academy"
              xpReward={80}
              progress={80}
              onBegin={() => setRewardOpen(true)}
            />
            <QuestCard
              title="Archive Runner"
              description="Revise DBMS notes before the Heartlight dims further."
              category="focus"
              difficulty="scout"
              district="academy"
              xpReward={20}
              progress={100}
              status="completed"
            />
          </div>
        </section>
      </main>

      <RewardPopup
        open={rewardOpen}
        onClose={() => setRewardOpen(false)}
        title="The First Signal"
        subtitle="70 XP gained. Academy lights flicker back."
        xp={80}
        shards={20}
        items={[
          { label: "Focus", value: "+1" },
          { label: "Storm Feather", value: "Unlocked" },
        ]}
      />
    </div>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="font-display text-xs uppercase tracking-[0.28em] text-muted">
      {children}
    </h2>
  );
}
