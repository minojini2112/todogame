import CityMap from "@/components/city/CityMap";
import { loadRpgState } from "@/modules/rpg/actions";

export const metadata = {
  title: "Aurelia Map — EchoBound",
  description: "Wake the four spirits. When all are collected, the city recovers.",
};

export default async function CityPage() {
  const state = await loadRpgState();
  return (
    <CityMap
      spirits={state.spirits}
      leaderboard={state.leaderboard}
      youId={state.profile.id}
    />
  );
}
