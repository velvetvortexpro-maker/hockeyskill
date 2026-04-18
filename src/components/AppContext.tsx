import { createContext, useContext } from "react";
import type { AppDataHook } from "../lib/useAppData";

export const AppCtx = createContext<AppDataHook | null>(null);

export function useApp(): AppDataHook {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("AppCtx missing");
  return ctx;
}
