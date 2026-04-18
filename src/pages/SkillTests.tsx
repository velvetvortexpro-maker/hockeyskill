import { useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useApp } from "../components/AppContext";
import { SKILL_TESTS, scoringLabel, scoringUnit, isImprovement } from "../lib/skillTests";
import { daysBetween, todayISO } from "../lib/dates";
import type { SkillTest } from "../types";

export function SkillTests() {
  const { data, addSkillTestResult } = useApp();
  const [activeTest, setActiveTest] = useState<SkillTest | null>(null);
  const [score, setScore] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function resultsFor(testId: string) {
    return data.skillTests
      .filter((r) => r.testId === testId)
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  function lastResultFor(testId: string) {
    const results = resultsFor(testId);
    return results[results.length - 1] ?? null;
  }

  function daysSinceLast(testId: string): number | null {
    const last = lastResultFor(testId);
    if (!last) return null;
    return daysBetween(last.date, todayISO());
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!activeTest || !score.trim()) return;
    setSubmitting(true);
    addSkillTestResult({
      testId: activeTest.id,
      date: todayISO(),
      score: parseFloat(score),
      notes: notes.trim() || undefined,
    });
    setScore("");
    setNotes("");
    setSubmitting(false);
    setActiveTest(null);
  }

  return (
    <div className="py-4 sm:py-6 space-y-6">
      <div>
        <h1 className="font-display text-3xl text-white">Färdighetstester</h1>
        <p className="text-white/60 text-sm">
          Objektiva tester var 28:e dag för att mäta verklig förbättring.
        </p>
      </div>

      <div className="space-y-4">
        {SKILL_TESTS.map((test) => {
          const results = resultsFor(test.id);
          const last = results[results.length - 1];
          const prev = results[results.length - 2];
          const daysSince = daysSinceLast(test.id);
          const dueForTest = daysSince === null || daysSince >= test.recommendedFrequencyDays;

          return (
            <motion.div key={test.id} className="card p-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl text-white">{test.name}</h2>
                  <div className="text-xs text-white/50 mt-0.5">
                    {scoringLabel(test.scoring)} • var {test.recommendedFrequencyDays} dagar
                  </div>
                </div>
                <div className="text-right shrink-0">
                  {last ? (
                    <div>
                      <div className="font-display text-2xl text-neon-cyan">
                        {last.score}{scoringUnit(test.scoring)}
                      </div>
                      {prev && (
                        <div className={`text-xs mt-0.5 ${isImprovement(test.scoring, last.score, prev.score) ? "text-neon-green" : "text-neon-red"}`}>
                          {isImprovement(test.scoring, last.score, prev.score) ? "▲" : "▼"} vs förra
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-white/30 text-sm">Ej testat</div>
                  )}
                </div>
              </div>

              {dueForTest && (
                <div className="text-xs text-neon-gold bg-neon-gold/10 border border-neon-gold/30 rounded-lg px-3 py-2">
                  {daysSince === null
                    ? "Du har inte gjort det här testet än — dags att börja!"
                    : `${daysSince} dagar sedan senaste testet — dags att testa igen!`}
                </div>
              )}

              {results.length > 1 && (
                <div className="h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={results.map((r) => ({
                        date: r.date.slice(5),
                        score: r.score,
                      }))}
                    >
                      <CartesianGrid stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="date" stroke="#ffffff66" fontSize={10} />
                      <YAxis
                        stroke="#ffffff66"
                        fontSize={10}
                        width={28}
                        reversed={test.scoring === "time"}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "#12121cee",
                          border: "1px solid #ffffff22",
                          borderRadius: 8,
                          color: "#fff",
                          fontSize: 12,
                        }}
                        formatter={(v) => v != null ? [`${v}${scoringUnit(test.scoring)}`, "Poäng"] : ["—", "Poäng"]}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#00f5ff"
                        strokeWidth={2}
                        dot={{ fill: "#00f5ff", r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              <button
                onClick={() => setActiveTest(test)}
                className="btn-primary text-sm"
                aria-label={`Kör ${test.name}`}
              >
                {results.length === 0 ? "Kör test" : "Kör igen"}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Test modal */}
      {activeTest && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setActiveTest(null)}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="card p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto"
          >
            <h2 className="font-display text-2xl text-white mb-2">{activeTest.name}</h2>

            <div className="mb-5">
              <div className="text-xs uppercase tracking-widest text-white/40 mb-2">Protokoll</div>
              <ol className="space-y-2">
                {activeTest.protocol.map((step, i) => (
                  <li key={i} className="flex gap-2 text-sm text-white/80">
                    <span className="text-neon-cyan font-bold shrink-0">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label" htmlFor="test-score">
                  Resultat ({scoringLabel(activeTest.scoring)})
                </label>
                <input
                  id="test-score"
                  type="number"
                  step="0.1"
                  className="input"
                  placeholder={`t.ex. ${activeTest.scoring === "time" ? "12.5" : "75"}`}
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  required
                  aria-label={`Ange resultat i ${scoringUnit(activeTest.scoring)}`}
                />
              </div>
              <div>
                <label className="label" htmlFor="test-notes">Anteckning (valfritt)</label>
                <input
                  id="test-notes"
                  type="text"
                  className="input"
                  placeholder="T.ex. 'Bra is, men trött i benen'"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setActiveTest(null)}
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                >
                  Spara resultat
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
