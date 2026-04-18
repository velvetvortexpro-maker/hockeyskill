import { motion } from "framer-motion";
import { restStreakFromDates, streakFromDates, todayISO } from "../lib/dates";
import type { Session } from "../types";

export function StreakCounter({
  sessions,
  restDays = [],
}: {
  sessions: Session[];
  restDays?: string[];
}) {
  const streak = streakFromDates(sessions.map((s) => s.date), restDays);
  const loggedToday = sessions.some((s) => s.date === todayISO());
  const isRestToday = restDays.includes(todayISO());
  const atRisk = streak > 0 && !loggedToday && !isRestToday;
  const restStreak = restStreakFromDates(restDays);

  return (
    <div
      className={`card p-5 relative overflow-hidden ${streak > 0 ? "animate-pulseGlow" : ""}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-white/50">Streak</div>
          <div className="flex items-baseline gap-2">
            <motion.span
              key={streak}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-display text-5xl text-white"
            >
              {streak}
            </motion.span>
            <span className="text-white/60">dagar</span>
          </div>
          {restStreak > 0 && (
            <div className="text-xs text-neon-green mt-0.5">
              🛌 {restStreak} vilodagar i rad
            </div>
          )}
        </div>
        <div className="text-5xl">
          {isRestToday ? "🛌" : streak >= 5 ? "🔥" : streak > 0 ? "✨" : "💤"}
        </div>
      </div>
      {isRestToday ? (
        <div className="mt-3 text-xs text-neon-green">
          🛌 Bra jobbat — vila är träning.
        </div>
      ) : atRisk ? (
        <div className="mt-3 text-xs text-neon-red">
          ⚠️ Du riskerar att tappa din streak — logga något idag!
        </div>
      ) : streak === 0 ? (
        <div className="mt-3 text-xs text-white/50">
          Logga en session för att starta din streak.
        </div>
      ) : (
        <div className="mt-3 text-xs text-neon-green">✅ Du är i zonen — fortsätt så!</div>
      )}
    </div>
  );
}
