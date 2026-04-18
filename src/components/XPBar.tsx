import { motion } from "framer-motion";
import type { LevelInfo } from "../lib/xp";

export function XPBar({ level }: { level: LevelInfo }) {
  return (
    <div className="card p-5">
      <div className="flex items-end justify-between mb-2">
        <div>
          <div className="text-xs uppercase tracking-widest text-white/50">
            Level
          </div>
          <div
            className="font-display text-3xl"
            style={{ color: level.color, textShadow: `0 0 15px ${level.color}55` }}
          >
            {level.name}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-widest text-white/50">
            XP
          </div>
          <div className="font-display text-2xl text-white">
            {level.currentXP.toLocaleString("sv-SE")}
          </div>
        </div>
      </div>
      <div className="h-3 bg-ice-800 rounded-full overflow-hidden border border-white/5">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${level.color}55, ${level.color})`,
            boxShadow: `0 0 15px ${level.color}aa`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${level.progressPct}%` }}
          transition={{ type: "spring", stiffness: 60, damping: 18 }}
        />
      </div>
      <div className="mt-2 text-xs text-white/50 flex justify-between">
        <span>{Math.round(level.progressPct)}% till nästa level</span>
        <span>
          {level.xpToNext > 0
            ? `${level.xpToNext.toLocaleString("sv-SE")} XP kvar`
            : "MAX"}
        </span>
      </div>
    </div>
  );
}
