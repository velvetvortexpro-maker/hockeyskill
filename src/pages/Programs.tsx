import { motion } from "framer-motion";
import { useApp } from "../components/AppContext";
import { PROGRAMS, totalDays } from "../lib/programs";
import { getDrillById } from "../lib/drills";
import type { ActiveProgram, Program } from "../types";

function progressOf(ap: ActiveProgram, program: Program): number {
  const total = totalDays(program);
  if (total === 0) return 0;
  return Math.round((ap.completedDays.length / total) * 100);
}

function currentDayOf(ap: ActiveProgram, program: Program) {
  let day = 0;
  for (let wi = 0; wi < program.weeks.length; wi++) {
    const week = program.weeks[wi];
    for (let di = 0; di < week.days.length; di++) {
      if (day === ap.completedDays.length) return { week: wi, day: di, programDay: week.days[di] };
      day++;
    }
  }
  return null;
}

export function Programs() {
  const { data, startProgram, advanceProgram, finishProgram } = useApp();

  function getActive(programId: string): ActiveProgram | undefined {
    return data.programs.find((ap) => ap.programId === programId);
  }

  return (
    <div className="py-4 sm:py-6 space-y-6">
      <div>
        <h1 className="font-display text-3xl text-white">Träningsprogram</h1>
        <p className="text-white/60 text-sm">
          Strukturerade program med dagliga pass. Starta ett och följ det dag för dag.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {PROGRAMS.map((program) => {
          const active = getActive(program.id);
          const isFinished = active?.currentWeek === -1;
          const prog = active ? progressOf(active, program) : 0;
          const current = active && !isFinished ? currentDayOf(active, program) : null;

          return (
            <motion.div
              key={program.id}
              whileHover={{ y: -2 }}
              className="card p-5 space-y-4"
            >
              <div>
                <h2 className="font-display text-xl text-white">{program.name}</h2>
                <div className="text-xs text-neon-cyan mt-0.5">{program.targetAudience}</div>
                <p className="text-white/60 text-sm mt-2">{program.description}</p>
                <div className="flex gap-3 mt-2 text-xs text-white/50">
                  <span>{program.weeks.length} veckor</span>
                  <span>•</span>
                  <span>{totalDays(program)} pass totalt</span>
                </div>
              </div>

              {active && !isFinished && (
                <div>
                  <div className="flex justify-between text-xs text-white/50 mb-1">
                    <span>Framsteg</span>
                    <span>{prog}%</span>
                  </div>
                  <div className="h-2 bg-ice-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-neon-cyan rounded-full transition-all duration-500"
                      style={{ width: `${prog}%` }}
                    />
                  </div>
                  <div className="text-xs text-white/40 mt-1">
                    {active.completedDays.length} / {totalDays(program)} pass klara
                  </div>
                </div>
              )}

              {isFinished && (
                <div className="flex items-center gap-2 text-neon-green text-sm">
                  <span>✅</span>
                  <span>Program slutfört!</span>
                </div>
              )}

              {current && (
                <div className="bg-ice-800/60 rounded-xl p-4 border border-neon-cyan/20">
                  <div className="text-xs uppercase tracking-widest text-neon-cyan mb-2">
                    Dagens pass — Vecka {current.week + 1}, Dag {current.day + 1}
                  </div>
                  <div className="text-sm text-white/80 mb-2 italic">
                    "{current.programDay.focusCue}"
                  </div>
                  <div className="space-y-1">
                    {current.programDay.drills.map((dd, i) => {
                      const drill = getDrillById(dd.drillId);
                      if (!drill) return null;
                      return (
                        <div key={i} className="flex justify-between text-xs text-white/60">
                          <span>{drill.name}</span>
                          <span>
                            {dd.sets} set{dd.reps ? ` × ${dd.reps}` : ""}
                            {dd.minutes ? ` × ${dd.minutes}min` : ""}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => {
                      const nextCompletedCount = (active?.completedDays.length ?? 0) + 1;
                      const tot = totalDays(program);
                      if (nextCompletedCount >= tot) {
                        finishProgram(program.id);
                      } else {
                        advanceProgram(program.id);
                      }
                    }}
                    className="btn-primary w-full mt-3 text-sm"
                  >
                    ✓ Logga dagens pass
                  </button>
                </div>
              )}

              {!active && (
                <button
                  onClick={() => startProgram(program.id)}
                  className="btn-primary w-full"
                >
                  Starta program
                </button>
              )}

              {active && isFinished && (
                <button
                  onClick={() => startProgram(program.id)}
                  className="btn-ghost w-full"
                >
                  Kör om programmet
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      {data.programs.length === 0 && (
        <div className="card p-6 text-center text-white/50 text-sm">
          Du har inte startat något program än. Välj ett ovan för att komma igång.
        </div>
      )}
    </div>
  );
}
