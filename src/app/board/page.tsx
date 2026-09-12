import type { Metadata } from "next";
import { loadRpgState } from "@/modules/rpg/actions";
import { CodexWorkspace } from "@/modules/rpg/components/CodexWorkspace";
import { SanctumFrame } from "@/modules/rpg/components/SanctumFrame";

export const metadata: Metadata = {
  title: "Tasks",
  description: "Pick a list, open its group columns, and manage tasks as cards.",
};

export default async function BoardPage() {
  const state = await loadRpgState();

  return (
    <SanctumFrame profile={state.profile} current="board">
      <CodexWorkspace
        lists={state.lists}
        groups={state.groups}
        quests={state.quests}
        whisper={null}
      />
    </SanctumFrame>
  );
}
