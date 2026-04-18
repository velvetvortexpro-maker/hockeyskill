import { describe, it, expect, vi } from "vitest";
import {
  metricValue,
  metricLabel,
  metricUnit,
  isQualityMetric,
  sessionsInWeek,
  goalProgressPct,
} from "../goals";
import type { Goal, GoalMetric, Session } from "../../types";

vi.useFakeTimers();
vi.setSystemTime(new Date("2024-01-15")); // Monday

function makeSession(date: string, overrides: Partial<Session> = {}): Session {
  return {
    id: Math.random().toString(),
    date,
    createdAt: 0,
    shots: { attempts: 10, onTarget: 7 },
    passes: { attempts: 20, completed: 16 },
    skating: { drill: "framat", minutes: 30 },
    technique: { stickhandling: 3, dekar: 3, balance: 3 },
    ...overrides,
  };
}

describe("metricValue", () => {
  const sessions = [
    makeSession("2024-01-15", { shots: { attempts: 20, onTarget: 14 }, passes: { attempts: 30, completed: 24 }, skating: { drill: "framat", minutes: 40 } }),
    makeSession("2024-01-16", { shots: { attempts: 10, onTarget: 8 }, passes: { attempts: 20, completed: 18 }, skating: { drill: "framat", minutes: 20 } }),
  ];

  it("counts shots", () => expect(metricValue(sessions, "shots")).toBe(30));
  it("counts passes", () => expect(metricValue(sessions, "passes")).toBe(50));
  it("counts skating minutes", () => expect(metricValue(sessions, "skatingMinutes")).toBe(60));
  it("counts sessions", () => expect(metricValue(sessions, "sessions")).toBe(2));

  it("computes shot accuracy average", () => {
    // s1: 70%, s2: 80% → avg 75
    const acc = metricValue(sessions, "shotAccuracy");
    expect(acc).toBe(75);
  });

  it("computes pass completion average", () => {
    // s1: 80%, s2: 90% → avg 85
    const comp = metricValue(sessions, "passCompletion");
    expect(comp).toBe(85);
  });

  it("returns 0 for quality metric with no sessions", () => {
    expect(metricValue([], "shotAccuracy")).toBe(0);
    expect(metricValue([], "passCompletion")).toBe(0);
  });
});

describe("isQualityMetric", () => {
  it("identifies quality metrics", () => {
    const quality: GoalMetric[] = ["shotAccuracy", "passCompletion", "skillTestScore", "programProgress"];
    quality.forEach((m) => expect(isQualityMetric(m)).toBe(true));
  });

  it("identifies volume metrics", () => {
    const volume: GoalMetric[] = ["shots", "passes", "skatingMinutes", "sessions"];
    volume.forEach((m) => expect(isQualityMetric(m)).toBe(false));
  });
});

describe("metricLabel and metricUnit", () => {
  it("returns labels for all metrics", () => {
    const metrics: GoalMetric[] = ["shots", "passes", "skatingMinutes", "sessions", "shotAccuracy", "passCompletion"];
    metrics.forEach((m) => expect(metricLabel(m).length).toBeGreaterThan(0));
  });

  it("returns % unit for quality metrics", () => {
    expect(metricUnit("shotAccuracy")).toBe("%");
    expect(metricUnit("passCompletion")).toBe("%");
    expect(metricUnit("shots")).toBe("");
  });
});

describe("sessionsInWeek", () => {
  const sessions = [
    makeSession("2024-01-08"),
    makeSession("2024-01-15"),
    makeSession("2024-01-16"),
    makeSession("2024-01-22"),
  ];

  it("returns only sessions in the given week", () => {
    const inWeek = sessionsInWeek(sessions, "2024-01-15");
    expect(inWeek).toHaveLength(2);
    expect(inWeek.map((s) => s.date)).toContain("2024-01-15");
    expect(inWeek.map((s) => s.date)).toContain("2024-01-16");
  });
});

describe("goalProgressPct", () => {
  const sessions = [makeSession("2024-01-15", { shots: { attempts: 60, onTarget: 40 } })];

  it("computes volume goal progress", () => {
    const goal: Goal = {
      id: "g1",
      title: "Test",
      metric: "shots",
      target: 100,
      weekStart: "2024-01-15",
    };
    expect(goalProgressPct(sessions, goal)).toBe(60);
  });

  it("caps at 100%", () => {
    const goal: Goal = {
      id: "g2",
      title: "Test",
      metric: "shots",
      target: 10,
      weekStart: "2024-01-15",
    };
    expect(goalProgressPct(sessions, goal)).toBe(100);
  });

  it("returns 0 for zero target", () => {
    const goal: Goal = {
      id: "g3",
      title: "Test",
      metric: "shots",
      target: 0,
      weekStart: "2024-01-15",
    };
    expect(goalProgressPct(sessions, goal)).toBe(0);
  });
});
