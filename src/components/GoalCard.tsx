import { motion } from "framer-motion";
import type { Goal, Session } from "../types";
import { goalCurrent, goalProgressPct, metricLabel } from "../lib/goals";

export function GoalCard({
  goal,
  sessions,
  onComplete,
  onDelete,
}: {
  goal: Goal;
  sessions: Session[];
  onComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
  const current = goalCurrent(sessions, goal);
  const pct = goalProgressPct(sessions, goal);
  const done = pct >= 100 || !!goal.completedAt;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card p-4 ${done ? "border-neon-green/40 shadow-[0_0_25px_rgba(45,212,191,0.25)]" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white truncate">{goal.title}</span>
            {goal.suggested && (
              <span className="stat-chip text-neon-cyan border-neon-cyan/30">
                Förslag
              </span>
            )}
            {done && <span className="text-neon-green text-xs">✅ Klar</span>}
          </div>
          <div className="text-xs text-white/50 mt-0.5">
            {current} / {goal.target} {metricLabel(goal.metric)}
          </div>
        </div>
        <div className="flex gap-1 shrink-0">
          {!done && pct >= 100 && onComplete && (
            <button
              onClick={() => onComplete(goal.id)}
              className="text-xs btn-ghost !px-2 !py-1 !rounded-lg"
              title="Markera som klar"
            >
              ✓
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(goal.id)}
              className="text-xs btn-ghost !px-2 !py-1 !rounded-lg"
              title="Ta bort"
            >
              ✕
            </button>
          )}
        </div>
      </div>
      <div className="mt-3 h-2.5 rounded-full bg-ice-800 overflow-hidden border border-white/5">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: done
              ? "linear-gradient(90deg, #2dd4bf55, #2dd4bf)"
              : "linear-gradient(90deg, #00f5ff55, #00f5ff)",
            boxShadow: done
              ? "0 0 15px #2dd4bfaa"
              : "0 0 15px #00f5ffaa",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(pct, 100)}%` }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        />
      </div>
      <div className="mt-1 text-right text-[11px] text-white/50">{pct}%</div>
    </motion.div>
  );
}
