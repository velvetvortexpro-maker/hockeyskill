import type { Goal, GoalMetric, Session } from "../types";
import { fromISO, mondayOf, thisMondayISO, toISO } from "./dates";
import { passAccuracyPct, shotAccuracyPct } from "./stats";

export type { GoalMetric };

export function sessionsInWeek(sessions: Session[], weekStart: string): Session[] {
  const start = fromISO(weekStart);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  return sessions.filter((s) => {
    const d = fromISO(s.date);
    return d >= start && d < end;
  });
}

export function metricValue(sessions: Session[], metric: GoalMetric): number {
  switch (metric) {
    case "shots":
      return sessions.reduce((a, s) => a + s.shots.attempts, 0);
    case "passes":
      return sessions.reduce((a, s) => a + s.passes.attempts, 0);
    case "skatingMinutes":
      return sessions.reduce((a, s) => a + s.skating.minutes, 0);
    case "sessions":
      return sessions.length;
    case "shotAccuracy": {
      // average shot accuracy across sessions with shots
      const withShots = sessions.filter((s) => s.shots.attempts > 0);
      if (withShots.length === 0) return 0;
      const avg =
        withShots.reduce((a, s) => a + shotAccuracyPct(s.shots), 0) /
        withShots.length;
      return Math.round(avg);
    }
    case "passCompletion": {
      const withPasses = sessions.filter((s) => s.passes.attempts > 0);
      if (withPasses.length === 0) return 0;
      const avg =
        withPasses.reduce((a, s) => a + passAccuracyPct(s.passes), 0) /
        withPasses.length;
      return Math.round(avg);
    }
    case "skillTestScore":
      return 0; // handled separately via SkillTestResult
    case "programProgress":
      return 0; // handled separately via ActiveProgram
  }
}

export function metricLabel(m: GoalMetric): string {
  return {
    shots: "skott",
    passes: "passningar",
    skatingMinutes: "skridsko-minuter",
    sessions: "sessioner",
    shotAccuracy: "% skotts träffsäkerhet",
    passCompletion: "% passnings-completion",
    skillTestScore: "poäng i färdighetstest",
    programProgress: "% programfärdighet",
  }[m];
}

export function metricUnit(m: GoalMetric): string {
  switch (m) {
    case "shotAccuracy":
    case "passCompletion":
    case "programProgress":
      return "%";
    case "skillTestScore":
      return "p";
    default:
      return "";
  }
}

export function isQualityMetric(m: GoalMetric): boolean {
  return ["shotAccuracy", "passCompletion", "skillTestScore", "programProgress"].includes(m);
}

export function suggestGoals(sessions: Session[]): Goal[] {
  const thisWeek = thisMondayISO();
  const lastWeekStart = toISO(
    (() => {
      const m = mondayOf(new Date());
      m.setDate(m.getDate() - 7);
      return m;
    })(),
  );
  const lastWeek = sessionsInWeek(sessions, lastWeekStart);

  const mk = (metric: GoalMetric, title: string, min: number): Goal => {
    const last = metricValue(lastWeek, metric);
    const target = Math.max(min, Math.round(last * 1.1));
    return {
      id: `sugg-${metric}-${thisWeek}`,
      title,
      metric,
      target,
      weekStart: thisWeek,
      suggested: true,
    };
  };

  return [
    mk("shots", "Vecka-skott", 80),
    mk("passes", "Vecka-passningar", 60),
    mk("skatingMinutes", "Skridsko-minuter", 60),
    mk("sessions", "Träningssessioner", 3),
    // quality goals — fixed thresholds, not volume-based
    {
      id: `sugg-shotAccuracy-${thisWeek}`,
      title: "Skotts träffsäkerhet",
      metric: "shotAccuracy",
      target: 60, // 60%
      weekStart: thisWeek,
      suggested: true,
    },
    {
      id: `sugg-passCompletion-${thisWeek}`,
      title: "Passnings-completion",
      metric: "passCompletion",
      target: 80, // 80%
      weekStart: thisWeek,
      suggested: true,
    },
  ];
}

export function goalProgressPct(sessions: Session[], g: Goal): number {
  const inWeek = sessionsInWeek(sessions, g.weekStart);
  const v = metricValue(inWeek, g.metric);
  return g.target === 0 ? 0 : Math.min(100, Math.round((v / g.target) * 100));
}

export function goalCurrent(sessions: Session[], g: Goal): number {
  const inWeek = sessionsInWeek(sessions, g.weekStart);
  return metricValue(inWeek, g.metric);
}
