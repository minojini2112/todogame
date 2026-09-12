import type { Metadata } from "next";
import { loadRpgState } from "@/modules/rpg/actions";
import { SanctumFrame } from "@/modules/rpg/components/SanctumFrame";
import { VaultView } from "@/modules/rpg/components/VaultView";

export const metadata: Metadata = {
  title: "Vault",
  description: "Companion cards fill from the efforts nobody else sees.",
};

export default async function VaultPage() {
  const state = await loadRpgState();

  return (
    <SanctumFrame profile={state.profile} current="vault">
      <div className="sanctum-panel sanctum-panel-glow mx-auto max-w-5xl rounded-[32px] border border-[rgba(232,196,140,0.28)] p-5 sm:p-8">
        <p className="font-display text-[10px] tracking-[0.28em] text-[var(--sanctum-gold)] uppercase">
          Companions
        </p>
        <h1 className="font-splash mt-1 text-3xl text-[var(--sanctum-ink)]">Spirit Vault</h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--sanctum-muted)]">
          Four companions watch how you work. Open a card to see what they’ve noticed — they fill
          when your quests match who they are.
        </p>
        <div className="mt-8">
          <VaultView spirits={state.spirits} stories={state.stories} />
        </div>
      </div>
    </SanctumFrame>
  );
}
