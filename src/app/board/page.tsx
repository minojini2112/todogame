import type { Metadata } from "next";
import { loadRpgState } from "@/modules/rpg/actions";
import { BoardExperience } from "@/modules/rpg/components/BoardExperience";

export const metadata: Metadata = {
  title: "Quests",
  description: "Organize paths and groups, add quests, and earn XP as you complete them.",
};

export default async function BoardPage() {
  const state = await loadRpgState();

  return (
    <BoardExperience
      profile={state.profile}
      lists={state.lists}
      groups={state.groups}
      quests={state.quests}
      spirits={state.spirits}
      stories={state.stories}
    />
  );
}
