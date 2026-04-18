import type { Session } from "../types";
import { passAccuracyPct, shotAccuracyPct } from "./stats";

export const LEVELS = [
  { name: "Rookie", min: 0, max: 500, color: "#8aa0b8" },
  { name: "Junior", min: 500, max: 1500, color: "#6cd2ff" },
  { name: "Semi-Pro", min: 1500, max: 3500, color: "#2dd4bf" },
  { name: "Pro", min: 3500, max: 7000, color: "#ffd700" },
  { name: "Elite", min: 7000, max: 12000, color: "#ff8c42" },
  { name: "Legend", min: 12000, max: Infinity, color: "#ff3860" },
] as const;

export type LevelInfo = {
  name: string;
  index: number;
  color: string;
  currentXP: number;
  levelMin: number;
  levelMax: number;
  progressPct: number;
  xpToNext: number;
};

export function levelFromXP(xp: number): LevelInfo {
  const idx = LEVELS.findIndex((l) => xp >= l.min && xp < l.max);
  const i = idx === -1 ? LEVELS.length - 1 : idx;
  const l = LEVELS[i];
  const span = l.max === Infinity ? 5000 : l.max - l.min;
  const rel = xp - l.min;
  const pct = l.max === Infinity ? 100 : Math.min(100, (rel / span) * 100);
  return {
    name: l.name,
    index: i,
    color: l.color,
    currentXP: xp,
    levelMin: l.min,
    levelMax: l.max,
    progressPct: pct,
    xpToNext: l.max === Infinity ? 0 : Math.max(0, l.max - xp),
  };
}

export function sessionXP(s: Session): number {
  const shots = s.shots.attempts;
  const onTarget = s.shots.onTarget;
  const passes = s.passes.attempts;
  const completed = s.passes.completed;
  const minutes = s.skating.minutes;
  const techAvg =
    (s.technique.stickhandling + s.technique.dekar + s.technique.balance) / 3;

  const shotAccPct = shotAccuracyPct(s.shots);
  const passAccPct = passAccuracyPct(s.passes);
  const shotAccFrac = shotAccPct / 100;
  const passAccFrac = passAccPct / 100;

  const volume =
    shots * 1 + onTarget * 1 + passes * 0.8 + completed * 0.6 + minutes * 4;

  // capped tech contribution so self-reported 5/5 can't grind XP indefinitely
  const techXP = Math.min(techAvg * 8, 32);

  // base quality: accuracy contribution
  let shotQualityXP = shotAccPct * 0.6;
  let passQualityXP = passAccPct * 0.5;

  // quality multiplier: reward reaching accuracy thresholds
  if (shots >= 5 && shotAccFrac >= 0.6) shotQualityXP *= 1.2;
  if (passes >= 5 && passAccFrac >= 0.8) passQualityXP *= 1.2;

  const quality = shotQualityXP + passQualityXP + techXP;
  const base = 40;

  let total = base + volume + quality;

  // coach-verified sessions get +15%
  if (s.verifiedByCoach) total *= 1.15;

  // game reflection bonus (applied at the game log level, not here)

  return Math.round(total);
}
