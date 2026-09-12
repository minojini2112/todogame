"use client";

import { SanctumFrame } from "@/modules/rpg/components/SanctumFrame";
import { CodexWorkspace } from "@/modules/rpg/components/CodexWorkspace";
import { BoardGuide, useBoardGuideAutoStart } from "@/modules/rpg/components/BoardGuide";
import { LeadingCompanion } from "@/modules/rpg/components/LeadingCompanion";
import type {
  RpgGroup,
  RpgList,
  RpgProfile,
  RpgQuest,
  RpgSpiritProgress,
  RpgSpiritStory,
} from "@/modules/rpg/types";

type BoardExperienceProps = {
  profile: RpgProfile;
  lists: RpgList[];
  groups: RpgGroup[];
  quests: RpgQuest[];
  spirits: RpgSpiritProgress[];
  stories: RpgSpiritStory[];
};

export function BoardExperience({
  profile,
  lists,
  groups,
  quests,
  spirits,
  stories,
}: BoardExperienceProps) {
  const guide = useBoardGuideAutoStart();

  return (
    <>
      <SanctumFrame profile={profile} current="board" onGuide={guide.start}>
        <div className="mx-auto flex max-w-[1280px] flex-col gap-5 lg:flex-row lg:items-stretch">
          <div className="min-w-0 flex-1">
            <CodexWorkspace lists={lists} groups={groups} quests={quests} whisper={null} />
          </div>
          <LeadingCompanion spirits={spirits} stories={stories} />
        </div>
      </SanctumFrame>
      <BoardGuide open={guide.open} onClose={guide.close} />
    </>
  );
}
