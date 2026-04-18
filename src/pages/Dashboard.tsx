import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useApp } from "../components/AppContext";
import { PlayerCard } from "../components/PlayerCard";
import { XPBar } from "../components/XPBar";
import { StreakCounter } from "../components/StreakCounter";
import { GoalCard } from "../components/GoalCard";
import { computeStats, passAccuracyPct, shotAccuracyPct, totals } from "../lib/stats";
import { metricLabel, metricUnit, suggestGoals } from "../lib/goals";
import { BADGES, rarityStyles } from "../lib/badges";
import { fromISO } from "../lib/dates";

export function Dashboard() {
  const { data, level, addGoal, completeGoal, deleteGoal } = useApp();
  const stats = computeStats(data.sessions, data.profile.position);
  const t = totals(data.sessions);
  const recent = [...data.sessions].slice(-5).reverse();

  const currentSuggestions = suggestGoals(data.sessions);
  const currentSuggestionMetrics = new Set(
    data.goals.map((g) => `${g.metric}-${g.weekStart}`),
  );
  const freshSuggestions = currentSuggestions.filter(
    (s) => !currentSuggestionMetrics.has(`${s.metric}-${s.weekStart}`),
  );
  const activeGoals = data.goals.filter((g) => !g.completedAt);

  const unlockedBadges = BADGES.filter((b) => data.unlockedBadges[b.id]).slice(-3);

  return (
    <div className="py-4 sm:py-6 space-y-6">
      <div className="grid gap-6 md:grid-cols-[auto_1fr]">
        <PlayerCard
          name={data.profile.name}
          position={data.profile.position}
          emoji={data.profile.emoji}
          jerseyNumber={data.profile.jerseyNumber}
          stats={stats}
          levelName={level.name}
          photoUrl={data.profile.photoUrl}
        />

        <div className="flex flex-col gap-4">
          <XPBar level={level} />
          <StreakCounter sessions={data.sessions} restDays={data.restDays} />

          <div className="grid grid-cols-3 gap-3">
            <MiniStat label="Sessioner" value={t.sessions} />
            <MiniStat
              label="Skott-%"
              value={
                t.shots === 0 ? "—" : `${shotAccuracyPct({ attempts: t.shots, onTarget: t.shotsOnTarget })}%`
              }
            />
            <MiniStat
              label="Pass-%"
              value={
                t.passes === 0
                  ? "—"
                  : `${passAccuracyPct({ attempts: t.passes, completed: t.passesCompleted })}%`
              }
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl text-white">Veckomål</h2>
            <Link to="/logga" className="btn-primary !py-2 !px-4 !rounded-lg text-sm">
              + Logga session
            </Link>
          </div>

          {activeGoals.length === 0 && (
            <div className="card p-4 text-sm text-white/50">
              Inga aktiva mål — välj ett förslag nedan.
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            {activeGoals.map((g) => (
              <GoalCard
                key={g.id}
                goal={g}
                sessions={data.sessions}
                onComplete={completeGoal}
                onDelete={deleteGoal}
              />
            ))}
          </div>

          {freshSuggestions.length > 0 && (
            <div className="pt-2">
              <div className="text-xs uppercase tracking-widest text-white/50 mb-2">
                Förslag denna vecka
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {freshSuggestions.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => addGoal(g)}
                    className="card p-3 text-left hover:border-neon-cyan/40 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-white">{g.title}</div>
                      <span className="text-neon-cyan text-sm">+ Lägg till</span>
                    </div>
                    <div className="text-xs text-white/50 mt-1">
                      Mål: {g.target}{metricUnit(g.metric)} {metricLabel(g.metric)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-2xl text-white">Senaste aktivitet</h2>
          {recent.length === 0 ? (
            <div className="card p-4 text-sm text-white/50">
              Inga sessioner än — logga din första.
            </div>
          ) : (
            <div className="space-y-2">
              {recent.map((s) => (
                <motion.div
                  key={s.id}
                  whileHover={{ x: 2 }}
                  className="card p-3 flex items-center justify-between"
                >
                  <div>
                    <div className="text-sm text-white">
                      {fromISO(s.date).toLocaleDateString("sv-SE", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </div>
                    <div className="text-xs text-white/60">
                      {s.shots.attempts > 0 && `${s.shots.attempts} skott • `}
                      {s.passes.attempts > 0 && `${s.passes.attempts} pass • `}
                      {s.skating.minutes}m skridsko
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    {s.shots.attempts > 0 && (
                      <div className="text-neon-cyan">
                        {shotAccuracyPct(s.shots)}% träff
                      </div>
                    )}
                    {s.passes.attempts > 0 && (
                      <div className="text-neon-green">
                        {passAccuracyPct(s.passes)}% pass
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display text-lg text-white">Senaste badges</h3>
              <Link to="/badges" className="text-xs text-neon-cyan">
                Visa alla →
              </Link>
            </div>
            {unlockedBadges.length === 0 ? (
              <div className="card p-4 text-sm text-white/60">
                Låsta. Logga träning för att börja samla badges.
              </div>
            ) : (
              <div className="space-y-2">
                {unlockedBadges.map((b) => {
                  const s = rarityStyles[b.rarity];
                  return (
                    <div
                      key={b.id}
                      className={`card p-3 flex items-center gap-3 bg-gradient-to-br ${s.bg}`}
                    >
                      <div className="text-2xl">{b.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-semibold ${s.text}`}>
                          {b.name}
                        </div>
                        <div className="text-xs text-white/60 truncate">
                          {b.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card p-3 text-center">
      <div className="text-[10px] uppercase tracking-widest text-white/50">
        {label}
      </div>
      <div className="font-display text-2xl text-white mt-1">{value}</div>
    </div>
  );
}
