import { SpiritCards } from "@/modules/rpg/components/SpiritCards";
import type { RpgSpiritProgress, RpgSpiritStory } from "@/modules/rpg/types";

export function VaultView({
  spirits,
  stories,
}: {
  spirits: RpgSpiritProgress[];
  stories: RpgSpiritStory[];
}) {
  return <SpiritCards spirits={spirits} stories={stories} />;
}
