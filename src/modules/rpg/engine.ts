/** Must match `rpg_xp_for_level` in Postgres. */
export function xpForLevel(level: number): number {
  return Math.max(80, Math.floor(80 * Math.pow(level, 1.55)));
}
