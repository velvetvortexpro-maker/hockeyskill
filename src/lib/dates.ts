// date helpers — all dates handled as YYYY-MM-DD strings in local time

export function todayISO(): string {
  return toISO(new Date());
}

export function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function fromISO(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export function mondayOf(d: Date): Date {
  const x = new Date(d);
  const day = x.getDay(); // Sun=0..Sat=6
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(x, diff);
}

export function thisMondayISO(): string {
  return toISO(mondayOf(new Date()));
}

export function weekLabel(d: Date): string {
  const m = mondayOf(d);
  return `v${getWeekNumber(m)}`;
}

export function getWeekNumber(d: Date): number {
  const target = new Date(d.valueOf());
  const dayNr = (d.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
}

/**
 * Consecutive-day streak. Rest days (marked explicitly) count as valid gap-fillers
 * so they don't break an active streak.
 */
export function streakFromDates(
  isoDates: string[],
  restDays: string[] = [],
): number {
  const trained = new Set(isoDates);
  const resting = new Set(restDays);
  let streak = 0;
  const cursor = new Date();

  // if today is neither trained nor rested, start from yesterday
  const todayStr = toISO(cursor);
  if (!trained.has(todayStr) && !resting.has(todayStr)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (true) {
    const str = toISO(cursor);
    if (trained.has(str) || resting.has(str)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

/** Streak counting only rest days (consecutive dedicated rest days). */
export function restStreakFromDates(restDays: string[]): number {
  const set = new Set(restDays);
  let streak = 0;
  const cursor = new Date();
  const todayStr = toISO(cursor);
  if (!set.has(todayStr)) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (set.has(toISO(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function daysBetween(aISO: string, bISO: string): number {
  const a = fromISO(aISO).getTime();
  const b = fromISO(bISO).getTime();
  return Math.round((b - a) / 86400000);
}
