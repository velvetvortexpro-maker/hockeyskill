import { describe, it, expect, beforeEach, vi } from "vitest";
import { streakFromDates, restStreakFromDates, toISO, fromISO, daysBetween, mondayOf } from "../dates";

describe("streakFromDates", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("returns 0 for empty dates", () => {
    vi.setSystemTime(new Date("2024-01-15"));
    expect(streakFromDates([])).toBe(0);
  });

  it("counts a streak of consecutive days", () => {
    vi.setSystemTime(new Date("2024-01-15"));
    const dates = ["2024-01-13", "2024-01-14", "2024-01-15"];
    expect(streakFromDates(dates)).toBe(3);
  });

  it("does not break when today is not logged (starts from yesterday)", () => {
    vi.setSystemTime(new Date("2024-01-15"));
    const dates = ["2024-01-13", "2024-01-14"];
    expect(streakFromDates(dates)).toBe(2);
  });

  it("breaks on gap in dates", () => {
    vi.setSystemTime(new Date("2024-01-15"));
    const dates = ["2024-01-10", "2024-01-14", "2024-01-15"];
    expect(streakFromDates(dates)).toBe(2);
  });

  it("rest days do not break streak", () => {
    vi.setSystemTime(new Date("2024-01-17"));
    const trained = ["2024-01-14", "2024-01-16", "2024-01-17"];
    const rest = ["2024-01-15"]; // rest day fills the gap
    expect(streakFromDates(trained, rest)).toBe(4);
  });

  it("pure rest days count toward streak", () => {
    vi.setSystemTime(new Date("2024-01-15"));
    const trained = ["2024-01-13"];
    const rest = ["2024-01-14", "2024-01-15"];
    expect(streakFromDates(trained, rest)).toBe(3);
  });
});

describe("restStreakFromDates", () => {
  it("counts consecutive rest days", () => {
    vi.setSystemTime(new Date("2024-01-15"));
    expect(restStreakFromDates(["2024-01-14", "2024-01-15"])).toBe(2);
  });

  it("returns 0 with no rest days", () => {
    vi.setSystemTime(new Date("2024-01-15"));
    expect(restStreakFromDates([])).toBe(0);
  });
});

describe("toISO / fromISO", () => {
  it("round-trips correctly", () => {
    const d = new Date(2024, 0, 15); // Jan 15 2024
    expect(toISO(d)).toBe("2024-01-15");
    expect(fromISO("2024-01-15").getFullYear()).toBe(2024);
    expect(fromISO("2024-01-15").getMonth()).toBe(0);
    expect(fromISO("2024-01-15").getDate()).toBe(15);
  });
});

describe("daysBetween", () => {
  it("returns 0 for same date", () => {
    expect(daysBetween("2024-01-15", "2024-01-15")).toBe(0);
  });

  it("returns 7 for a week", () => {
    expect(daysBetween("2024-01-08", "2024-01-15")).toBe(7);
  });

  it("handles negative direction", () => {
    expect(daysBetween("2024-01-15", "2024-01-08")).toBe(-7);
  });
});

describe("mondayOf", () => {
  it("returns Monday for a Wednesday", () => {
    const wed = new Date(2024, 0, 17); // Jan 17 2024 is Wednesday
    const mon = mondayOf(wed);
    expect(mon.getDay()).toBe(1); // Monday
    expect(toISO(mon)).toBe("2024-01-15");
  });

  it("returns Monday for a Monday", () => {
    const mon = new Date(2024, 0, 15);
    expect(toISO(mondayOf(mon))).toBe("2024-01-15");
  });

  it("returns previous Monday for Sunday", () => {
    const sun = new Date(2024, 0, 21); // Sunday
    const mon = mondayOf(sun);
    expect(toISO(mon)).toBe("2024-01-15");
  });
});
