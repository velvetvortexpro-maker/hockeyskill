export type Position = "Center" | "Back" | "Forward" | "Goalie";

export type SkateDrill = "framat" | "bakat" | "crossovers" | "stopp";

export type Session = {
  id: string;
  date: string; // YYYY-MM-DD
  createdAt: number;
  shots: { attempts: number; onTarget: number };
  passes: { attempts: number; completed: number };
  skating: { drill: SkateDrill; minutes: number };
  technique: {
    stickhandling: number; // 1-5
    dekar: number; // 1-5
    balance: number; // 1-5
  };
  note?: string;
  verifiedByCoach?: boolean;
  tackling?: { onesWon: number; onesLost: number; gapReps: number };
  offIce?: {
    stickhandlingMin: number;
    shootingPadShots: number;
    agilityMin: number;
    mobilityMin: number;
  };
  wellness?: {
    sleepHours: number;
    rpe: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    soreness: 1 | 2 | 3 | 4 | 5;
    mood: 1 | 2 | 3 | 4 | 5;
  };
  goalieStats?: { shotsFaced: number; saves: number };
  videoUrl?: string;
  selfReview?: {
    weightTransfer: boolean;
    stickFlex: boolean;
    followThrough: boolean;
    notes: string;
  };
  drills?: { drillId: string; reps?: number; minutes?: number }[];
};

export type GoalMetric =
  | "shots"
  | "passes"
  | "skatingMinutes"
  | "sessions"
  | "shotAccuracy"
  | "passCompletion"
  | "skillTestScore"
  | "programProgress";

export type Goal = {
  id: string;
  title: string;
  metric: GoalMetric;
  target: number; // for quality goals: threshold (0-100 for pct, raw score for skillTest)
  weekStart: string; // YYYY-MM-DD (Monday)
  suggested?: boolean;
  completedAt?: number;
};

export type Profile = {
  name: string;
  position: Position;
  emoji: string;
  jerseyNumber: number;
  createdAt: number;
  photoUrl?: string;
};

export type DrillCategory =
  | "skating"
  | "shooting"
  | "passing"
  | "puck"
  | "offIce"
  | "goalie";

export type DrillLevel = "beginner" | "intermediate" | "advanced";

export type Drill = {
  id: string;
  name: string;
  category: DrillCategory;
  position: Position[];
  level: DrillLevel;
  cues: string[];
  videoUrl?: string;
  progressions: { drillId: string; unlockAfter: number }[];
  defaultDuration: number; // minutes
};

export type ProgramDay = {
  drills: { drillId: string; sets: number; reps?: number; minutes?: number }[];
  focusCue: string;
};

export type ProgramWeek = {
  days: ProgramDay[];
};

export type Program = {
  id: string;
  name: string;
  description: string;
  targetAudience: string;
  weeks: ProgramWeek[];
};

export type ActiveProgram = {
  programId: string;
  startedAt: string; // YYYY-MM-DD
  currentWeek: number; // 0-indexed
  currentDay: number; // 0-indexed within week
  completedDays: string[]; // YYYY-MM-DD of completed days
};

export type SkillTest = {
  id: string;
  name: string;
  protocol: string[];
  scoring: "time" | "count" | "percent";
  recommendedFrequencyDays: number;
};

export type SkillTestResult = {
  id: string;
  testId: string;
  date: string;
  score: number;
  notes?: string;
};

export type GameLog = {
  id: string;
  date: string;
  opponent: string;
  ourScore: number;
  theirScore: number;
  shifts?: number;
  iceTimeMin?: number;
  plusMinus?: number;
  goals?: number;
  assists?: number;
  shotsOnGoal?: number;
  hits?: number;
  blockedShots?: number;
  didWell?: string;
  toWorkOn?: string;
  // Goalie-specific
  saves?: number;
  shotsAgainst?: number;
  goalsAgainst?: number;
  savePct?: number;
};

export type TeamInvite = {
  code: string;
  teamId: string;
  teamName: string;
};

export type Comment = {
  id: string;
  sessionId: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: number;
  isCoach: boolean;
};

export type User = {
  id: string;
  email: string;
  displayName: string;
};

export type AppData = {
  schemaVersion: number;
  profile: Profile;
  sessions: Session[];
  goals: Goal[];
  unlockedBadges: Record<string, number>; // badgeId -> timestamp
  xp: number;
  programs: ActiveProgram[];
  skillTests: SkillTestResult[];
  games: GameLog[];
  restDays: string[]; // YYYY-MM-DD
  language: "sv" | "en";
};

export type Stats = {
  shot: number;
  skating: number;
  passing: number;
  technique: number;
  tackling: number; // for Goalie position: represents goaltending rating
};
