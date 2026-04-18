import type { AppData, Session } from "../types";
import { streakFromDates } from "./dates";
import { computeOverall, computeStats, shotAccuracyPct, totals } from "./stats";

export type Badge = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  rarity: "bronze" | "silver" | "gold" | "legend";
  track: "volume" | "mastery";
  check: (data: AppData) => boolean;
};

export const BADGES: Badge[] = [
  // --- volume track ---
  {
    id: "first_shift",
    name: "First Shift",
    description: "Logga din första träningssession.",
    emoji: "🏒",
    rarity: "bronze",
    track: "volume",
    check: (d) => d.sessions.length >= 1,
  },
  {
    id: "sniper",
    name: "Sniper",
    description: "Skjut totalt 1000 skott.",
    emoji: "🎯",
    rarity: "gold",
    track: "volume",
    check: (d) => totals(d.sessions).shots >= 1000,
  },
  {
    id: "sharpshooter",
    name: "Sharpshooter",
    description: "Nå 80% träffsäkerhet i en enskild session (min 10 skott).",
    emoji: "💥",
    rarity: "silver",
    track: "volume",
    check: (d) =>
      d.sessions.some(
        (s: Session) => s.shots.attempts >= 10 && shotAccuracyPct(s.shots) >= 80,
      ),
  },
  {
    id: "playmaker",
    name: "Playmaker",
    description: "500 lyckade passningar totalt.",
    emoji: "🎩",
    rarity: "gold",
    track: "volume",
    check: (d) => totals(d.sessions).passesCompleted >= 500,
  },
  {
    id: "iron_man",
    name: "Iron Man",
    description: "30 dagars träningsstreak.",
    emoji: "🔥",
    rarity: "legend",
    track: "volume",
    check: (d) =>
      streakFromDates(d.sessions.map((s) => s.date), d.restDays) >= 30,
  },
  {
    id: "gretzky_mode",
    name: "Gretzky Mode",
    description: "Alla stats över 80.",
    emoji: "👑",
    rarity: "legend",
    track: "volume",
    check: (d) => {
      const s = computeStats(d.sessions, d.profile.position);
      return (
        s.shot > 80 &&
        s.skating > 80 &&
        s.passing > 80 &&
        s.technique > 80 &&
        s.tackling > 80
      );
    },
  },
  {
    id: "weekly_warrior",
    name: "Weekly Warrior",
    description: "Logga träning 5 dagar i rad.",
    emoji: "⚡",
    rarity: "silver",
    track: "volume",
    check: (d) =>
      streakFromDates(d.sessions.map((s) => s.date), d.restDays) >= 5,
  },
  {
    id: "rink_rat",
    name: "Rink Rat",
    description: "Logga 600 minuter skridsko.",
    emoji: "⛸️",
    rarity: "silver",
    track: "volume",
    check: (d) => totals(d.sessions).skatingMinutes >= 600,
  },
  {
    id: "overall_85",
    name: "All-Star",
    description: "Nå Overall 85+.",
    emoji: "⭐",
    rarity: "gold",
    track: "volume",
    check: (d) =>
      computeOverall(computeStats(d.sessions, d.profile.position), d.profile.position) >= 85,
  },
  {
    id: "ten_sessions",
    name: "Committed",
    description: "Logga 10 träningssessioner.",
    emoji: "📈",
    rarity: "bronze",
    track: "volume",
    check: (d) => d.sessions.length >= 10,
  },
  // --- mastery track ---
  {
    id: "sniper_pro",
    name: "Sniper Pro",
    description: "Uppnå 70%+ träffsäkerhet i ett färdighetstest (100 skott).",
    emoji: "🔫",
    rarity: "gold",
    track: "mastery",
    check: (d) =>
      d.skillTests.some(
        (r) => r.testId === "shooting_zones" && r.score >= 70,
      ),
  },
  {
    id: "edge_master",
    name: "Edge Master",
    description: "Klara alla skridsko-tester på advanced-nivå.",
    emoji: "⚔️",
    rarity: "legend",
    track: "mastery",
    check: (d) => {
      const skatingTestIds = ["forward_backward_loop", "stop_start_sprint", "transition_test"];
      return skatingTestIds.every((tid) =>
        d.skillTests.some((r) => r.testId === tid),
      );
    },
  },
  {
    id: "program_finisher",
    name: "Program Finisher",
    description: "Slutför ett helt träningsprogram.",
    emoji: "🏆",
    rarity: "gold",
    track: "mastery",
    check: (d) =>
      d.programs.some((ap) => {
        // completed if all days logged
        return ap.completedDays.length > 0 && ap.currentWeek === -1;
      }),
  },
  {
    id: "verified_allstar",
    name: "Verified All-Star",
    description: "Overall 85+ med minst 50% coach-verifierade sessioner.",
    emoji: "✅",
    rarity: "legend",
    track: "mastery",
    check: (d) => {
      const overall = computeOverall(
        computeStats(d.sessions, d.profile.position),
        d.profile.position,
      );
      if (overall < 85) return false;
      const verified = d.sessions.filter((s) => s.verifiedByCoach).length;
      return d.sessions.length > 0 && verified / d.sessions.length >= 0.5;
    },
  },
  {
    id: "mind_game",
    name: "Mind Game",
    description: "Slutför 10 mentala träningsövningar.",
    emoji: "🧠",
    rarity: "silver",
    track: "mastery",
    check: (_d) => false, // tracked via mental exercise log (future feature hook)
  },
];

export function evaluateBadges(data: AppData): {
  newlyUnlocked: string[];
  updated: Record<string, number>;
} {
  const updated: Record<string, number> = { ...data.unlockedBadges };
  const newlyUnlocked: string[] = [];
  for (const b of BADGES) {
    if (!updated[b.id] && b.check(data)) {
      updated[b.id] = Date.now();
      newlyUnlocked.push(b.id);
    }
  }
  return { newlyUnlocked, updated };
}

export const rarityStyles: Record<
  Badge["rarity"],
  { text: string; bg: string; ring: string }
> = {
  bronze: {
    text: "text-orange-300",
    bg: "from-orange-900/40 to-orange-700/10",
    ring: "ring-orange-500/30",
  },
  silver: {
    text: "text-slate-200",
    bg: "from-slate-700/40 to-slate-500/10",
    ring: "ring-slate-300/30",
  },
  gold: {
    text: "text-yellow-200",
    bg: "from-yellow-700/40 to-yellow-500/10",
    ring: "ring-yellow-400/40",
  },
  legend: {
    text: "text-pink-200",
    bg: "from-fuchsia-700/40 to-rose-600/20",
    ring: "ring-pink-400/50",
  },
};
