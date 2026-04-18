import type { Position, Session, Stats } from "../types";

const clamp = (v: number, min = 1, max = 99) =>
  Math.max(min, Math.min(max, Math.round(v)));

function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0);
}
function safeRatio(n: number, d: number) {
  return d === 0 ? 0 : n / d;
}

export function computeStats(sessions: Session[], position?: Position): Stats {
  const totalShots = sum(sessions.map((s) => s.shots.attempts));
  const totalOnTarget = sum(sessions.map((s) => s.shots.onTarget));
  const shotAccuracy = safeRatio(totalOnTarget, totalShots);

  const totalPasses = sum(sessions.map((s) => s.passes.attempts));
  const totalCompleted = sum(sessions.map((s) => s.passes.completed));
  const passAcc = safeRatio(totalCompleted, totalPasses);

  const totalSkateMin = sum(sessions.map((s) => s.skating.minutes));
  const sessionsCount = sessions.length;

  const avgTech =
    sessionsCount === 0
      ? 0
      : sum(
          sessions.map(
            (s) =>
              (s.technique.stickhandling +
                s.technique.dekar +
                s.technique.balance) /
              3,
          ),
        ) / sessionsCount;

  const shot = clamp(40 + totalShots * 0.025 + shotAccuracy * 30);
  const skating = clamp(40 + totalSkateMin * 0.25 + sessionsCount * 0.5);
  const passing = clamp(40 + totalPasses * 0.04 + passAcc * 30);
  const technique = clamp(35 + avgTech * 10 + sessionsCount * 0.6);

  // real tackling from logged 1v1 data; fall back to session-volume proxy
  const tacklingData = sessions.filter(
    (s) => s.tackling && (s.tackling.onesWon + s.tackling.onesLost) > 0,
  );
  let tackling: number;
  if (tacklingData.length > 0) {
    const totalWon = sum(tacklingData.map((s) => s.tackling!.onesWon));
    const totalLost = sum(tacklingData.map((s) => s.tackling!.onesLost));
    const totalGap = sum(tacklingData.map((s) => s.tackling!.gapReps));
    const winRate = safeRatio(totalWon, totalWon + totalLost);
    tackling = clamp(35 + winRate * 40 + totalGap * 0.3 + sessionsCount * 0.3);
  } else {
    tackling = clamp(35 + sessionsCount * 0.8 + totalSkateMin * 0.1);
  }

  // for Goalie: override tackling with goaltending rating
  if (position === "Goalie") {
    const goalieSessions = sessions.filter(
      (s) => s.goalieStats && s.goalieStats.shotsFaced > 0,
    );
    if (goalieSessions.length > 0) {
      const totalShotsFaced = sum(
        goalieSessions.map((s) => s.goalieStats!.shotsFaced),
      );
      const totalSaves = sum(
        goalieSessions.map((s) => s.goalieStats!.saves),
      );
      const savePct = safeRatio(totalSaves, totalShotsFaced);
      tackling = clamp(35 + savePct * 55 + goalieSessions.length * 0.5);
    } else {
      tackling = clamp(35 + sessionsCount * 0.8);
    }
  }

  return { shot, skating, passing, technique, tackling };
}

const weights: Record<Position, Record<keyof Stats, number>> = {
  Center: {
    passing: 0.25,
    technique: 0.25,
    shot: 0.2,
    skating: 0.2,
    tackling: 0.1,
  },
  Back: {
    tackling: 0.25,
    skating: 0.25,
    passing: 0.2,
    shot: 0.15,
    technique: 0.15,
  },
  Forward: {
    shot: 0.25,
    skating: 0.2,
    technique: 0.2,
    passing: 0.2,
    tackling: 0.15,
  },
  Goalie: {
    tackling: 0.35, // goaltending
    skating: 0.25,
    technique: 0.2,
    passing: 0.1,
    shot: 0.1,
  },
};

export function computeOverall(stats: Stats, position: Position): number {
  const w = weights[position];
  const total =
    stats.shot * w.shot +
    stats.skating * w.skating +
    stats.passing * w.passing +
    stats.technique * w.technique +
    stats.tackling * w.tackling;
  return clamp(total);
}

export function statLabel(stat: keyof Stats, position: Position): string {
  if (stat === "tackling" && position === "Goalie") return "Målvakt";
  return {
    shot: "Skott",
    skating: "Skridsko",
    passing: "Passning",
    technique: "Teknik",
    tackling: "Tackling",
  }[stat];
}

export function shotAccuracyPct(s: Session["shots"]): number {
  return s.attempts === 0 ? 0 : Math.round((s.onTarget / s.attempts) * 100);
}

export function passAccuracyPct(s: Session["passes"]): number {
  return s.attempts === 0 ? 0 : Math.round((s.completed / s.attempts) * 100);
}

export function totals(sessions: Session[]) {
  return {
    shots: sum(sessions.map((s) => s.shots.attempts)),
    shotsOnTarget: sum(sessions.map((s) => s.shots.onTarget)),
    passes: sum(sessions.map((s) => s.passes.attempts)),
    passesCompleted: sum(sessions.map((s) => s.passes.completed)),
    skatingMinutes: sum(sessions.map((s) => s.skating.minutes)),
    sessions: sessions.length,
  };
}
