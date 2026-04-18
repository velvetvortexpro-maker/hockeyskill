import type { AppData, Profile } from "../types";

const SCHEMA_VERSION = 2;
const KEY = "hockey-skills-tracker/v1"; // keep same key to migrate in-place

const defaultProfile: Profile = {
  name: "Ny Spelare",
  position: "Forward",
  emoji: "🏒",
  jerseyNumber: 99,
  createdAt: Date.now(),
};

export const emptyData = (): AppData => ({
  schemaVersion: SCHEMA_VERSION,
  profile: { ...defaultProfile, createdAt: Date.now() },
  sessions: [],
  goals: [],
  unlockedBadges: {},
  xp: 0,
  programs: [],
  skillTests: [],
  games: [],
  restDays: [],
  language: "sv",
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function migrate(raw: any): AppData {
  const version = raw.schemaVersion ?? 1;
  let data = raw;

  if (version < 2) {
    // v1 → v2: add new top-level fields
    data = {
      ...data,
      schemaVersion: 2,
      programs: data.programs ?? [],
      skillTests: data.skillTests ?? [],
      games: data.games ?? [],
      restDays: data.restDays ?? [],
      language: data.language ?? "sv",
      profile: {
        ...defaultProfile,
        ...(data.profile ?? {}),
      },
      goals: (data.goals ?? []).map((g: { metric?: string } & Record<string, unknown>) => ({
        ...g,
        metric: g.metric ?? "sessions",
      })),
    };
  }

  return data as AppData;
}

export function loadData(): AppData {
  if (typeof window === "undefined") return emptyData();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyData();
    const parsed = JSON.parse(raw);
    const migrated = migrate(parsed);
    return {
      ...emptyData(),
      ...migrated,
      profile: { ...defaultProfile, ...(migrated.profile || {}) },
      unlockedBadges: migrated.unlockedBadges || {},
    };
  } catch {
    return emptyData();
  }
}

export function saveData(data: AppData) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function resetData() {
  localStorage.removeItem(KEY);
}
