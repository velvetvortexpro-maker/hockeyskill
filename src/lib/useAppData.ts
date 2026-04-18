import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  ActiveProgram,
  AppData,
  GameLog,
  Goal,
  Profile,
  Session,
  SkillTestResult,
} from "../types";
import { loadData, saveData, resetData } from "./storage";
import { sessionXP, levelFromXP, type LevelInfo } from "./xp";
import { evaluateBadges } from "./badges";
import { todayISO } from "./dates";

export type AppDataHook = {
  data: AppData;
  level: LevelInfo;
  addSession: (s: Omit<Session, "id" | "createdAt">) => {
    xpGained: number;
    newlyUnlocked: string[];
    leveledUp: boolean;
    newLevelName?: string;
  };
  deleteSession: (id: string) => void;
  updateProfile: (p: Partial<Profile>) => void;
  addGoal: (g: Omit<Goal, "id">) => void;
  completeGoal: (id: string) => void;
  deleteGoal: (id: string) => void;
  addGame: (g: Omit<GameLog, "id">) => void;
  deleteGame: (id: string) => void;
  addSkillTestResult: (r: Omit<SkillTestResult, "id">) => void;
  startProgram: (programId: string) => void;
  advanceProgram: (programId: string) => void;
  finishProgram: (programId: string) => void;
  addRestDay: (date?: string) => void;
  removeRestDay: (date: string) => void;
  setLanguage: (lang: "sv" | "en") => void;
  reset: () => void;
};

export function useAppData(): AppDataHook {
  const [data, setData] = useState<AppData>(() => loadData());

  useEffect(() => {
    saveData(data);
  }, [data]);

  const level = useMemo(() => levelFromXP(data.xp), [data.xp]);

  const addSession: AppDataHook["addSession"] = useCallback((input) => {
    const session: Session = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    const xpGained = sessionXP(session);
    let leveledUp = false;
    let newLevelName: string | undefined;
    let newlyUnlocked: string[] = [];

    setData((prev) => {
      const before = levelFromXP(prev.xp);
      const nextXP = prev.xp + xpGained;
      const after = levelFromXP(nextXP);
      leveledUp = after.index > before.index;
      newLevelName = after.name;
      const withSession: AppData = {
        ...prev,
        sessions: [...prev.sessions, session].sort(
          (a, b) => a.date.localeCompare(b.date) || a.createdAt - b.createdAt,
        ),
        xp: nextXP,
      };
      const { newlyUnlocked: un, updated } = evaluateBadges(withSession);
      newlyUnlocked = un;
      return { ...withSession, unlockedBadges: updated };
    });

    return { xpGained, newlyUnlocked, leveledUp, newLevelName };
  }, []);

  const deleteSession = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      sessions: prev.sessions.filter((s) => s.id !== id),
    }));
  }, []);

  const updateProfile = useCallback((p: Partial<Profile>) => {
    setData((prev) => ({ ...prev, profile: { ...prev.profile, ...p } }));
  }, []);

  const addGoal = useCallback((g: Omit<Goal, "id">) => {
    setData((prev) => ({
      ...prev,
      goals: [...prev.goals, { ...g, id: crypto.randomUUID() }],
    }));
  }, []);

  const completeGoal = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.map((g) =>
        g.id === id ? { ...g, completedAt: Date.now() } : g,
      ),
    }));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setData((prev) => ({ ...prev, goals: prev.goals.filter((g) => g.id !== id) }));
  }, []);

  const addGame = useCallback((g: Omit<GameLog, "id">) => {
    const game: GameLog = { ...g, id: crypto.randomUUID() };
    setData((prev) => ({
      ...prev,
      games: [...prev.games, game].sort((a, b) => b.date.localeCompare(a.date)),
      // game reflection gives +50 XP bonus
      xp: prev.xp + (g.didWell || g.toWorkOn ? 50 : 0),
    }));
  }, []);

  const deleteGame = useCallback((id: string) => {
    setData((prev) => ({ ...prev, games: prev.games.filter((g) => g.id !== id) }));
  }, []);

  const addSkillTestResult = useCallback((r: Omit<SkillTestResult, "id">) => {
    const result: SkillTestResult = { ...r, id: crypto.randomUUID() };
    setData((prev) => ({
      ...prev,
      skillTests: [...prev.skillTests, result].sort((a, b) =>
        b.date.localeCompare(a.date),
      ),
    }));
  }, []);

  const startProgram = useCallback((programId: string) => {
    const ap: ActiveProgram = {
      programId,
      startedAt: todayISO(),
      currentWeek: 0,
      currentDay: 0,
      completedDays: [],
    };
    setData((prev) => ({
      ...prev,
      programs: [
        ...prev.programs.filter((p) => p.programId !== programId),
        ap,
      ],
    }));
  }, []);

  const advanceProgram = useCallback((programId: string) => {
    setData((prev) => {
      const programs = prev.programs.map((ap) => {
        if (ap.programId !== programId) return ap;
        return {
          ...ap,
          completedDays: [...ap.completedDays, todayISO()],
          currentDay: ap.currentDay + 1,
        };
      });
      return { ...prev, programs };
    });
  }, []);

  const finishProgram = useCallback((programId: string) => {
    setData((prev) => {
      const programs = prev.programs.map((ap) => {
        if (ap.programId !== programId) return ap;
        return {
          ...ap,
          completedDays: [...ap.completedDays, todayISO()],
          currentWeek: -1, // sentinel: finished
        };
      });
      // re-evaluate badges after finish
      const updated = { ...prev, programs };
      const { updated: newBadges } = evaluateBadges(updated);
      return { ...updated, unlockedBadges: newBadges };
    });
  }, []);

  const addRestDay = useCallback((date?: string) => {
    const d = date ?? todayISO();
    setData((prev) => ({
      ...prev,
      restDays: prev.restDays.includes(d) ? prev.restDays : [...prev.restDays, d],
    }));
  }, []);

  const removeRestDay = useCallback((date: string) => {
    setData((prev) => ({
      ...prev,
      restDays: prev.restDays.filter((d) => d !== date),
    }));
  }, []);

  const setLanguage = useCallback((lang: "sv" | "en") => {
    setData((prev) => ({ ...prev, language: lang }));
  }, []);

  const reset = useCallback(() => {
    resetData();
    setData(loadData());
  }, []);

  return {
    data,
    level,
    addSession,
    deleteSession,
    updateProfile,
    addGoal,
    completeGoal,
    deleteGoal,
    addGame,
    deleteGame,
    addSkillTestResult,
    startProgram,
    advanceProgram,
    finishProgram,
    addRestDay,
    removeRestDay,
    setLanguage,
    reset,
  };
}
