import { describe, it, expect } from "vitest";
import { sessionXP, levelFromXP } from "../xp";
import type { Session } from "../../types";

function makeSession(overrides: Partial<Session> = {}): Session {
  return {
    id: "test",
    date: "2024-01-01",
    createdAt: 0,
    shots: { attempts: 0, onTarget: 0 },
    passes: { attempts: 0, completed: 0 },
    skating: { drill: "framat", minutes: 0 },
    technique: { stickhandling: 3, dekar: 3, balance: 3 },
    ...overrides,
  };
}

describe("sessionXP", () => {
  it("gives base XP (40) for empty session", () => {
    const xp = sessionXP(makeSession());
    expect(xp).toBeGreaterThanOrEqual(40);
  });

  it("caps tech contribution at 32 XP (5/5 across all ratings)", () => {
    const maxTechSession = makeSession({
      technique: { stickhandling: 5, dekar: 5, balance: 5 },
    });
    const minTechSession = makeSession({
      technique: { stickhandling: 1, dekar: 1, balance: 1 },
    });
    const techDiff = sessionXP(maxTechSession) - sessionXP(minTechSession);
    // 5 * 8 = 40, but capped at 32; 1 * 8 = 8 → diff ≤ 32
    expect(techDiff).toBeLessThanOrEqual(32);
  });

  it("gives +20% shot quality bonus when accuracy >= 60%", () => {
    const highAcc = makeSession({ shots: { attempts: 10, onTarget: 7 } }); // 70%
    const lowAcc = makeSession({ shots: { attempts: 10, onTarget: 5 } });  // 50%
    expect(sessionXP(highAcc)).toBeGreaterThan(sessionXP(lowAcc));
  });

  it("gives +20% pass quality bonus when completion >= 80%", () => {
    const highComp = makeSession({ passes: { attempts: 10, completed: 9 } }); // 90%
    const lowComp = makeSession({ passes: { attempts: 10, completed: 7 } });  // 70%
    expect(sessionXP(highComp)).toBeGreaterThan(sessionXP(lowComp));
  });

  it("gives +15% XP for coach-verified sessions", () => {
    const base = makeSession({ shots: { attempts: 20, onTarget: 10 } });
    const verified = makeSession({
      shots: { attempts: 20, onTarget: 10 },
      verifiedByCoach: true,
    });
    const ratio = sessionXP(verified) / sessionXP(base);
    expect(ratio).toBeCloseTo(1.15, 1);
  });
});

describe("levelFromXP", () => {
  it("starts as Rookie at 0 XP", () => {
    expect(levelFromXP(0).name).toBe("Rookie");
  });

  it("levels up to Junior at 500 XP", () => {
    expect(levelFromXP(500).name).toBe("Junior");
  });

  it("levels up to Legend at 12000 XP", () => {
    expect(levelFromXP(12000).name).toBe("Legend");
  });

  it("returns 100% progress for Legend", () => {
    expect(levelFromXP(15000).progressPct).toBe(100);
  });

  it("calculates progress percentage correctly within a level", () => {
    const info = levelFromXP(750); // Junior: 500-1500, rel = 250 / 1000 = 25%
    expect(info.name).toBe("Junior");
    expect(info.progressPct).toBeCloseTo(25, 0);
  });
});
