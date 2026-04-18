import { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "../components/AppContext";
import { todayISO, fromISO } from "../lib/dates";
import type { GameLog } from "../types";

function savePct(saves: number, shots: number): number {
  return shots === 0 ? 0 : Math.round((saves / shots) * 1000) / 10;
}

export function Game() {
  const { data, addGame, deleteGame } = useApp();
  const isGoalie = data.profile.position === "Goalie";

  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState(todayISO());
  const [opponent, setOpponent] = useState("");
  const [ourScore, setOurScore] = useState(0);
  const [theirScore, setTheirScore] = useState(0);
  const [iceTimeMin, setIceTimeMin] = useState(0);
  const [plusMinus, setPlusMinus] = useState(0);
  const [goals, setGoals] = useState(0);
  const [assists, setAssists] = useState(0);
  const [shotsOnGoal, setShotsOnGoal] = useState(0);
  const [didWell, setDidWell] = useState("");
  const [toWorkOn, setToWorkOn] = useState("");
  // Goalie
  const [saves, setSaves] = useState(0);
  const [shotsAgainst, setShotsAgainst] = useState(0);

  function reset() {
    setDate(todayISO());
    setOpponent("");
    setOurScore(0);
    setTheirScore(0);
    setIceTimeMin(0);
    setPlusMinus(0);
    setGoals(0);
    setAssists(0);
    setShotsOnGoal(0);
    setDidWell("");
    setToWorkOn("");
    setSaves(0);
    setShotsAgainst(0);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!opponent.trim()) return;
    const game: Omit<GameLog, "id"> = {
      date,
      opponent: opponent.trim(),
      ourScore,
      theirScore,
      iceTimeMin: iceTimeMin || undefined,
      plusMinus: plusMinus || undefined,
      goals: goals || undefined,
      assists: assists || undefined,
      shotsOnGoal: shotsOnGoal || undefined,
      didWell: didWell.trim() || undefined,
      toWorkOn: toWorkOn.trim() || undefined,
      ...(isGoalie
        ? {
            saves,
            shotsAgainst,
            goalsAgainst: shotsAgainst - saves,
            savePct: savePct(saves, shotsAgainst),
          }
        : {}),
    };
    addGame(game);
    reset();
    setShowForm(false);
  }

  // totals / averages
  const games = data.games;
  const avgGoals =
    games.length === 0
      ? 0
      : Math.round((games.reduce((a, g) => a + (g.goals ?? 0), 0) / games.length) * 10) / 10;
  const avgAssists =
    games.length === 0
      ? 0
      : Math.round((games.reduce((a, g) => a + (g.assists ?? 0), 0) / games.length) * 10) / 10;
  const avgSavePct =
    isGoalie && games.length > 0
      ? Math.round(
          games.reduce((a, g) => a + (g.savePct ?? 0), 0) / games.length * 10,
        ) / 10
      : null;

  return (
    <div className="py-4 sm:py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-white">Matchlogg</h1>
          <p className="text-white/60 text-sm">Logga matcher och reflektera.</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="btn-primary"
          aria-label="Lägg till ny match"
        >
          + Ny match
        </button>
      </div>

      {/* Summary */}
      {games.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="card p-3 text-center">
            <div className="text-[10px] uppercase tracking-widest text-white/50">Matcher</div>
            <div className="font-display text-2xl text-white mt-1">{games.length}</div>
          </div>
          {isGoalie ? (
            <div className="card p-3 text-center">
              <div className="text-[10px] uppercase tracking-widest text-white/50">Snitt SV%</div>
              <div className="font-display text-2xl text-neon-cyan mt-1">
                {avgSavePct ?? "–"}%
              </div>
            </div>
          ) : (
            <>
              <div className="card p-3 text-center">
                <div className="text-[10px] uppercase tracking-widest text-white/50">Snitt mål</div>
                <div className="font-display text-2xl text-neon-gold mt-1">{avgGoals}</div>
              </div>
              <div className="card p-3 text-center">
                <div className="text-[10px] uppercase tracking-widest text-white/50">Snitt assist</div>
                <div className="font-display text-2xl text-neon-cyan mt-1">{avgAssists}</div>
              </div>
            </>
          )}
          <div className="card p-3 text-center">
            <div className="text-[10px] uppercase tracking-widest text-white/50">Vinster</div>
            <div className="font-display text-2xl text-neon-green mt-1">
              {games.filter((g) => g.ourScore > g.theirScore).length}
            </div>
          </div>
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="card p-5 space-y-4"
        >
          <h2 className="font-display text-xl text-white">Logga match</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="game-date">Datum</label>
              <input
                id="game-date"
                type="date"
                className="input"
                value={date}
                max={todayISO()}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="game-opponent">Motståndare</label>
              <input
                id="game-opponent"
                type="text"
                className="input"
                placeholder="T.ex. Djurgårdens IF"
                value={opponent}
                onChange={(e) => setOpponent(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="game-our">Våra mål</label>
              <input
                id="game-our"
                type="number"
                min={0}
                className="input"
                value={ourScore}
                onChange={(e) => setOurScore(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="label" htmlFor="game-their">Deras mål</label>
              <input
                id="game-their"
                type="number"
                min={0}
                className="input"
                value={theirScore}
                onChange={(e) => setTheirScore(Number(e.target.value))}
              />
            </div>
          </div>

          {isGoalie ? (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="game-saves">Räddningar</label>
                <input
                  id="game-saves"
                  type="number"
                  min={0}
                  className="input"
                  value={saves}
                  onChange={(e) => setSaves(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="label" htmlFor="game-shots-against">Skott mot</label>
                <input
                  id="game-shots-against"
                  type="number"
                  min={0}
                  className="input"
                  value={shotsAgainst}
                  onChange={(e) => setShotsAgainst(Number(e.target.value))}
                />
              </div>
              {shotsAgainst > 0 && (
                <div className="sm:col-span-2 text-neon-cyan text-sm">
                  SV%: {savePct(saves, shotsAgainst)}%
                </div>
              )}
            </div>
          ) : (
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="label" htmlFor="game-goals">Mål</label>
                <input
                  id="game-goals"
                  type="number"
                  min={0}
                  className="input"
                  value={goals}
                  onChange={(e) => setGoals(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="label" htmlFor="game-assists">Assist</label>
                <input
                  id="game-assists"
                  type="number"
                  min={0}
                  className="input"
                  value={assists}
                  onChange={(e) => setAssists(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="label" htmlFor="game-plus-minus">+/–</label>
                <input
                  id="game-plus-minus"
                  type="number"
                  className="input"
                  value={plusMinus}
                  onChange={(e) => setPlusMinus(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="label" htmlFor="game-shots">Skott på mål</label>
                <input
                  id="game-shots"
                  type="number"
                  min={0}
                  className="input"
                  value={shotsOnGoal}
                  onChange={(e) => setShotsOnGoal(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="label" htmlFor="game-icetime">Istid (min)</label>
                <input
                  id="game-icetime"
                  type="number"
                  min={0}
                  className="input"
                  value={iceTimeMin}
                  onChange={(e) => setIceTimeMin(Number(e.target.value))}
                />
              </div>
            </div>
          )}

          <div>
            <label className="label" htmlFor="game-did-well">Vad gick bra? (+50 XP)</label>
            <textarea
              id="game-did-well"
              className="input min-h-[80px] resize-y"
              placeholder="T.ex. Bra skating ur hörnen, bra förstaskott..."
              value={didWell}
              onChange={(e) => setDidWell(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="game-work-on">Vad ska du jobba på?</label>
            <textarea
              id="game-work-on"
              className="input min-h-[80px] resize-y"
              placeholder="T.ex. Backhand-passning under press..."
              value={toWorkOn}
              onChange={(e) => setToWorkOn(e.target.value)}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              className="btn-ghost"
              onClick={() => { reset(); setShowForm(false); }}
            >
              Avbryt
            </button>
            <button type="submit" className="btn-primary">Spara match</button>
          </div>
        </motion.form>
      )}

      {/* Match history */}
      {games.length === 0 ? (
        <div className="card p-6 text-center text-white/50 text-sm">
          Inga matcher loggade ännu — lägg till din första match ovan.
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="font-display text-xl text-white">Matchhistorik</h2>
          {games.map((g) => {
            const won = g.ourScore > g.theirScore;
            const draw = g.ourScore === g.theirScore;
            return (
              <motion.div
                key={g.id}
                whileHover={{ x: 2 }}
                className={`card p-4 border-l-4 ${won ? "border-l-neon-green" : draw ? "border-l-neon-gold" : "border-l-neon-red"}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white">
                      vs {g.opponent}
                    </div>
                    <div className="text-sm text-white/60 mt-0.5">
                      {fromISO(g.date).toLocaleDateString("sv-SE", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                    {(g.didWell || g.toWorkOn) && (
                      <div className="mt-2 space-y-1">
                        {g.didWell && (
                          <div className="text-xs text-neon-green">✓ {g.didWell}</div>
                        )}
                        {g.toWorkOn && (
                          <div className="text-xs text-white/50">→ {g.toWorkOn}</div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`font-display text-2xl ${won ? "text-neon-green" : draw ? "text-neon-gold" : "text-neon-red"}`}>
                      {g.ourScore}–{g.theirScore}
                    </div>
                    {isGoalie && g.savePct !== undefined && (
                      <div className="text-neon-cyan text-sm mt-0.5">SV% {g.savePct}%</div>
                    )}
                    {!isGoalie && (g.goals !== undefined || g.assists !== undefined) && (
                      <div className="text-white/50 text-xs mt-0.5">
                        {g.goals ?? 0}G {g.assists ?? 0}A
                      </div>
                    )}
                    <button
                      onClick={() => deleteGame(g.id)}
                      className="text-xs text-white/20 hover:text-neon-red mt-1 transition"
                      aria-label={`Ta bort match mot ${g.opponent}`}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
