import type { Metadata } from "next";
import { loadRpgState } from "@/modules/rpg/actions";
import { SanctumFrame } from "@/modules/rpg/components/SanctumFrame";
import { VaultView } from "@/modules/rpg/components/VaultView";

export const metadata: Metadata = {
  title: "Vault",
  description: "Spirit cards fill from the efforts nobody else sees.",
};

export default async function VaultPage() {
  const state = await loadRpgState();

  return (
    <SanctumFrame profile={state.profile} current="vault">
      <div className="sanctum-panel mx-auto max-w-5xl rounded-2xl p-5 sm:p-8">
        <p className="text-xs text-[var(--sanctum-gold)]">Spirits</p>
        <h1 className="font-splash mt-1 text-3xl">Vault</h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--sanctum-muted)]">
          Four cards. They fill only when your work matches who they are.
        </p>
        <div className="mt-8">
          <VaultView spirits={state.spirits} stories={state.stories} />
        </div>
      </div>
    </SanctumFrame>
  );
}
