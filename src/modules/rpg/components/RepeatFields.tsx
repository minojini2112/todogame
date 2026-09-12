"use client";

import { useState } from "react";
import { QUEST_REPEATS, QUEST_REPEAT_UNITS, repeatEveryMax } from "@/modules/rpg/catalog";
import type { RpgRepeat, RpgRepeatUnit } from "@/modules/rpg/types";

type RepeatFieldsProps = {
  fieldClass: string;
  defaultRule?: RpgRepeat;
  defaultEvery?: number;
  defaultUnit?: RpgRepeatUnit;
};

export function RepeatFields({
  fieldClass,
  defaultRule = "none",
  defaultEvery = 1,
  defaultUnit = "day",
}: RepeatFieldsProps) {
  const [rule, setRule] = useState<RpgRepeat>(defaultRule);
  const [unit, setUnit] = useState<RpgRepeatUnit>(defaultUnit);
  const max = repeatEveryMax(unit);

  return (
    <div className="grid gap-3 sm:col-span-2">
      <label className="grid gap-2 text-xs text-[var(--sanctum-muted)]">
        Repeat
        <select
          name="repeat"
          value={rule}
          onChange={(event) => setRule(event.target.value as RpgRepeat)}
          className={fieldClass}
        >
          {QUEST_REPEATS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
        <span>{QUEST_REPEATS.find((item) => item.id === rule)?.hint}</span>
      </label>
      {rule === "custom" ? (
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <label className="grid gap-2 text-xs text-[var(--sanctum-muted)]">
            Every
            <input
              name="repeat_every"
              type="number"
              min={1}
              max={max}
              defaultValue={Math.min(defaultEvery, max)}
              className={fieldClass}
            />
          </label>
          <label className="grid gap-2 text-xs text-[var(--sanctum-muted)]">
            Time scale
            <select
              name="repeat_unit"
              value={unit}
              onChange={(event) => setUnit(event.target.value as RpgRepeatUnit)}
              className={fieldClass}
            >
              {QUEST_REPEAT_UNITS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <p className="text-xs text-[var(--sanctum-muted)] sm:col-span-2">
            Up to {max} {QUEST_REPEAT_UNITS.find((item) => item.id === unit)?.label.toLowerCase()}.
          </p>
        </div>
      ) : (
        <>
          <input type="hidden" name="repeat_every" value="1" />
          <input type="hidden" name="repeat_unit" value="day" />
        </>
      )}
    </div>
  );
}
