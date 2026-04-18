import { describe, it, expect } from "vitest";
import { computeStats, computeOverall, shotAccuracyPct, passAccuracyPct } from "../stats";
import type { Session } from "../../types";

function makeSession(overrides: Partial<Session> = {}): Session {
  return {
    id: "t",
    date: "2024-01-01",
    createdAt: 0,
    shots: { attempts: 20, onTarget: 10 },
    passes: { attempts: 30, completed: 20 },
    skating: { drill: "framat", minutes: 30 },
    technique: { stickhandling: 3, dekar: 3, balance: 3 },
    ...overrides,
  };
}

describe("computeStats", () => {
  it("returns all stats between 1-99", () => {
    const s = computeStats([makeSession()]);
    for (const v of Object.values(s)) {
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(99);
    }
  });

  it("computes real tackling from onesWon/onesLost when provided", () => {
    const withTackling = makeSession({
      tackling: { onesWon: 8, onesLost: 2, gapReps: 10 },
    });
    const withoutTackling = makeSession();
    const sWith = computeStats([withTackling]);
    const sWithout = computeStats([withoutTackling]);
    // High win-rate (80%) should give higher tackling than volume-proxy
    expect(sWith.tackling).toBeGreaterThan(sWithout.tackling);
  });

  it("uses goaltending formula for Goalie position", () => {
    const goalieSessions = [
      makeSession({ goalieStats: { shotsFaced: 30, saves: 27 } }),
    ];
    const goalieStats = computeStats(goalieSessions, "Goalie");
    // 90% save rate should push tackling (goaltending) well above baseline
    expect(goalieStats.tackling).toBeGreaterThan(60);
  });

  it("returns higher stats with more sessions", () => {
    const one = computeStats([makeSession()]);
    const ten = computeStats(Array.from({ length: 10 }, () => makeSession()));
    expect(ten.skating).toBeGreaterThanOrEqual(one.skating);
  });
});

describe("computeOverall", () => {
  it("uses Goalie weights that sum to 1", () => {
    // All stats = 50 → overall should be ~50 for any position
    const flat = { shot: 50, skating: 50, passing: 50, technique: 50, tackling: 50 };
    expect(computeOverall(flat, "Forward")).toBe(50);
    expect(computeOverall(flat, "Goalie")).toBe(50);
    expect(computeOverall(flat, "Back")).toBe(50);
  });
});

describe("accuracy helpers", () => {
  it("returns 0 for 0 attempts", () => {
    expect(shotAccuracyPct({ attempts: 0, onTarget: 0 })).toBe(0);
    expect(passAccuracyPct({ attempts: 0, completed: 0 })).toBe(0);
  });

  it("returns 100 for perfect accuracy", () => {
    expect(shotAccuracyPct({ attempts: 10, onTarget: 10 })).toBe(100);
    expect(passAccuracyPct({ attempts: 10, completed: 10 })).toBe(100);
  });

  it("rounds correctly", () => {
    expect(shotAccuracyPct({ attempts: 3, onTarget: 1 })).toBe(33);
  });
});
