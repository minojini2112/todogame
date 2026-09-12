"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SPIRIT_UNLOCK } from "@/modules/rpg/spirits";
import type { RpgSpiritId, RpgSpiritProgress } from "@/modules/rpg/types";

type Hint = {
  speaker: string;
  line: string;
  forSpirit?: RpgSpiritId;
};

const HINTS: Hint[] = [
  {
    speaker: "Lupen",
    forSpirit: "wolf",
    line: "Finish a task before it is due. I only notice a fair early finish, not a date set months away.",
  },
  {
    speaker: "Lupen",
    forSpirit: "wolf",
    line: "Give something a real due time you can beat today. Arrive before that hour and I will mark the stone.",
  },
  {
    speaker: "Aerin",
    forSpirit: "eagle",
    line: "Stay with one task until it is actually done. Split attention does not wake Focus.",
  },
  {
    speaker: "Aerin",
    forSpirit: "eagle",
    line: "Choose one hard thing. Close the rest. The stone fills when your mind has a single path.",
  },
  {
    speaker: "Sylva",
    forSpirit: "deer",
    line: "Rest, eat well, or be kind. Care is work. I notice the quiet ones.",
  },
  {
    speaker: "Sylva",
    forSpirit: "deer",
    line: "A gentle task still saves Aurelia. Sleep, a meal, a call. Gentleness is not a pause in the story.",
  },
  {
    speaker: "Pyra",
    forSpirit: "phoenix",
    line: "Come back to a task you left. Second tries are how I wake. The world forgets them. I do not.",
  },
  {
    speaker: "Pyra",
    forSpirit: "phoenix",
    line: "Finish something late anyway. Rising is still rising. That is how this stone turns gold.",
  },
  {
    speaker: "Pyra",
    forSpirit: "phoenix",
    line: "Keep a repeating task. Showing up again is how a city is rebuilt.",
  },
  {
    speaker: "Aurelia",
    line: "Open Tasks. Every honest finish feeds a stone. When all four wake, the city recovers.",
  },
  {
    speaker: "Aurelia",
    line: "You cannot pick which spirit scores. Do the work as it is. They will notice the human part.",
  },
  {
    speaker: "Aurelia",
    line: "After you finish, open the Vault. The reason a spirit marked you is written on its card.",
  },
  {
    speaker: "Aurelia",
    line: "Empty farming will not unlock a stone. Real effort is what saves this world.",
  },
  {
    speaker: "Aurelia",
    line: "Four stones. Four kinds of showing up. Collect them all and the light comes back.",
  },
];

const RECOVERED: Hint = {
  speaker: "Aurelia",
  line: "The four stones are whole. Keep the work. The city remembers those who stay.",
};

function sleepingIds(spirits: RpgSpiritProgress[]) {
  const ids: RpgSpiritId[] = ["eagle", "deer", "wolf", "phoenix"];
  return ids.filter((id) => {
    const points = spirits.find((row) => row.spirit_id === id)?.points ?? 0;
    return points < SPIRIT_UNLOCK;
  });
}

function shuffleHints(spirits: RpgSpiritProgress[], recovered: boolean): Hint[] {
  if (recovered) return [RECOVERED, ...HINTS.filter((hint) => !hint.forSpirit)];
  const asleep = new Set(sleepingIds(spirits));
  const preferred = HINTS.filter((hint) => !hint.forSpirit || asleep.has(hint.forSpirit));
  const rest = HINTS.filter((hint) => !preferred.includes(hint));
  const pool = [...preferred, ...rest];
  const start = Math.floor(Math.random() * pool.length);
  return [...pool.slice(start), ...pool.slice(0, start)];
}

export function CityStoryLine({
  spirits,
  recovered,
}: {
  spirits: RpgSpiritProgress[];
  recovered: boolean;
}) {
  const lines = useMemo(() => shuffleHints(spirits, recovered), [spirits, recovered]);
  const [index, setIndex] = useState(0);
  const hint = lines[index] ?? HINTS[0];

  return (
    <aside className="pointer-events-none absolute inset-x-0 bottom-0 z-40 select-none">
      <div className="bg-[linear-gradient(180deg,transparent,rgba(4,6,10,0.72)_36%,rgba(4,6,10,0.92))] px-4 pt-8 pb-3 sm:px-8 sm:pb-4">
        <div className="pointer-events-auto mx-auto flex max-w-3xl items-center gap-3">
          <div className="min-w-0 flex-1 rounded-full border border-white/10 bg-[rgba(8,12,18,0.94)] px-5 py-2.5 select-none">
            <p className="text-[10px] tracking-[0.28em] text-white/45 uppercase">{hint.speaker}</p>
            <p className="mt-0.5 text-sm leading-5 text-white/90">{hint.line}</p>
          </div>
          <Link
            href="/board"
            className="shrink-0 rounded-full bg-[#ffc857] px-5 py-2.5 text-[11px] tracking-[0.22em] text-[#07111f] uppercase"
          >
            Tasks
          </Link>
          <button
            type="button"
            onClick={() => setIndex((current) => (current + 1) % lines.length)}
            className="shrink-0 rounded-full border border-white/15 bg-[rgba(8,12,18,0.94)] px-5 py-2.5 text-[11px] tracking-[0.22em] text-white/80 uppercase"
          >
            Next →
          </button>
        </div>
      </div>
    </aside>
  );
}
