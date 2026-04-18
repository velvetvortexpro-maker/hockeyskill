import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAppData } from "./lib/useAppData";
import { AppCtx } from "./components/AppContext";
import { Layout } from "./components/Layout";
import { ToastStack, type Toast } from "./components/Toast";
import { BADGES } from "./lib/badges";

// Eager-load primary routes for instant paint
import { Dashboard } from "./pages/Dashboard";
import { LogTraining } from "./pages/LogTraining";

// Code-split secondary routes
const Stats = lazy(() => import("./pages/Stats").then((m) => ({ default: m.Stats })));
const Badges = lazy(() => import("./pages/Badges").then((m) => ({ default: m.Badges })));
const Settings = lazy(() => import("./pages/Settings").then((m) => ({ default: m.Settings })));
const Drills = lazy(() => import("./pages/Drills").then((m) => ({ default: m.Drills })));
const Programs = lazy(() => import("./pages/Programs").then((m) => ({ default: m.Programs })));
const SkillTests = lazy(() => import("./pages/SkillTests").then((m) => ({ default: m.SkillTests })));
const Game = lazy(() => import("./pages/Game").then((m) => ({ default: m.Game })));
const Mental = lazy(() => import("./pages/Mental").then((m) => ({ default: m.Mental })));

function PageFallback() {
  return (
    <div className="flex items-center justify-center h-48 text-white/40 text-sm">
      Laddar…
    </div>
  );
}

function App() {
  const app = useAppData();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const prevUnlockedRef = useRef(app.data.unlockedBadges);

  const push = useCallback((t: Omit<Toast, "id">) => {
    setToasts((xs) => [
      ...xs,
      { id: Math.random().toString(36).slice(2), ...t },
    ]);
  }, []);

  const dismiss = useCallback(
    (id: string) => setToasts((xs) => xs.filter((x) => x.id !== id)),
    [],
  );

  useEffect(() => {
    const prev = prevUnlockedRef.current;
    const now = app.data.unlockedBadges;
    for (const id of Object.keys(now)) {
      if (!prev[id]) {
        const b = BADGES.find((x) => x.id === id);
        if (b) {
          push({
            title: `Badge upplåst: ${b.name}`,
            body: b.description,
            emoji: b.emoji,
            tone: "badge",
          });
        }
      }
    }
    prevUnlockedRef.current = now;
  }, [app.data.unlockedBadges, push]);

  const wrapped = {
    ...app,
    addSession: (input: Parameters<typeof app.addSession>[0]) => {
      const res = app.addSession(input);
      push({
        title: "Session loggad",
        body: `+${res.xpGained} XP`,
        emoji: "✨",
        tone: "success",
      });
      if (res.leveledUp && res.newLevelName) {
        push({
          title: `LEVEL UP: ${res.newLevelName}`,
          body: "Du är grym — fortsätt såhär!",
          emoji: "⬆️",
          tone: "level",
        });
      }
      return res;
    },
  };

  return (
    <AppCtx.Provider value={wrapped}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/logga" element={<LogTraining />} />
            <Route
              path="/stats"
              element={
                <Suspense fallback={<PageFallback />}>
                  <Stats />
                </Suspense>
              }
            />
            <Route
              path="/badges"
              element={
                <Suspense fallback={<PageFallback />}>
                  <Badges />
                </Suspense>
              }
            />
            <Route
              path="/installningar"
              element={
                <Suspense fallback={<PageFallback />}>
                  <Settings />
                </Suspense>
              }
            />
            <Route
              path="/drills"
              element={
                <Suspense fallback={<PageFallback />}>
                  <Drills />
                </Suspense>
              }
            />
            <Route
              path="/program"
              element={
                <Suspense fallback={<PageFallback />}>
                  <Programs />
                </Suspense>
              }
            />
            <Route
              path="/tester"
              element={
                <Suspense fallback={<PageFallback />}>
                  <SkillTests />
                </Suspense>
              }
            />
            <Route
              path="/match"
              element={
                <Suspense fallback={<PageFallback />}>
                  <Game />
                </Suspense>
              }
            />
            <Route
              path="/mental"
              element={
                <Suspense fallback={<PageFallback />}>
                  <Mental />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastStack toasts={toasts} dismiss={dismiss} />
    </AppCtx.Provider>
  );
}

export default App;
