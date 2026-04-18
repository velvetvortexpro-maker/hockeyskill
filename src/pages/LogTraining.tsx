import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useApp } from "../components/AppContext";
import { todayISO } from "../lib/dates";
import { Confetti } from "../components/Confetti";
import { DRILLS } from "../lib/drills";
import { BADGES } from "../lib/badges";
import type { SkateDrill, Session, DrillCategory } from "../types";

const skateDrills: { value: SkateDrill; label: string }[] = [
  { value: "framat", label: "Framåt" },
  { value: "bakat", label: "Bakåt" },
  { value: "crossovers", label: "Crossovers" },
  { value: "stopp", label: "Stopp" },
];

const DRILL_CATEGORIES: { value: DrillCategory; label: string; icon: string }[] = [
  { value: "skating", label: "Skridsko", icon: "⛸️" },
  { value: "shooting", label: "Skott", icon: "🎯" },
  { value: "passing", label: "Passning", icon: "🎩" },
  { value: "puck", label: "Puck", icon: "🖤" },
  { value: "offIce", label: "Off-ice", icon: "🏋️" },
  { value: "goalie", label: "Målvakt", icon: "🥅" },
];

export function LogTraining() {
  const { addSession, data } = useApp();
  const nav = useNavigate();
  const isGoalie = data.profile.position === "Goalie";

  // Base
  const [date, setDate] = useState(todayISO());
  const [shotAttempts, setShotAttempts] = useState(0);
  const [shotOnTarget, setShotOnTarget] = useState(0);
  const [passAttempts, setPassAttempts] = useState(0);
  const [passCompleted, setPassCompleted] = useState(0);
  const [drill, setDrill] = useState<SkateDrill>("framat");
  const [minutes, setMinutes] = useState(20);
  const [stickhandling, setStickhandling] = useState(3);
  const [dekar, setDekar] = useState(3);
  const [balance, setBalance] = useState(3);
  const [note, setNote] = useState("");

  // Goalie stats
  const [shotsFaced, setShotsFaced] = useState(0);
  const [saves, setSaves] = useState(0);

  // Drills
  const [selectedDrills, setSelectedDrills] = useState<
    { drillId: string; minutes?: number; reps?: number }[]
  >([]);
  const [drillCat, setDrillCat] = useState<DrillCategory>("skating");
  const [showDrillPicker, setShowDrillPicker] = useState(false);

  // Wellness
  const [showWellness, setShowWellness] = useState(false);
  const [sleepHours, setSleepHours] = useState(8);
  const [rpe, setRpe] = useState<number>(6);
  const [soreness, setSoreness] = useState<number>(2);
  const [mood, setMood] = useState<number>(3);

  // Video
  const [videoUrl, setVideoUrl] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const [weightTransfer, setWeightTransfer] = useState(false);
  const [stickFlex, setStickFlex] = useState(false);
  const [followThrough, setFollowThrough] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");

  // Summary
  const [confetti, setConfetti] = useState(false);
  const [summary, setSummary] = useState<{
    xp: number;
    leveledUp: boolean;
    newLevelName?: string;
    newlyUnlocked: string[];
  } | null>(null);

  const shotPct = shotAttempts === 0 ? 0 : Math.round((shotOnTarget / shotAttempts) * 100);
  const passPct = passAttempts === 0 ? 0 : Math.round((passCompleted / passAttempts) * 100);
  const goalieSavePct = shotsFaced === 0 ? 0 : Math.round((saves / shotsFaced) * 100);

  function addDrill(drillId: string) {
    if (selectedDrills.find((d) => d.drillId === drillId)) return;
    setSelectedDrills((prev) => [...prev, { drillId, minutes: 10 }]);
  }
  function removeDrill(drillId: string) {
    setSelectedDrills((prev) => prev.filter((d) => d.drillId !== drillId));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (shotOnTarget > shotAttempts) {
      alert("On target kan inte vara högre än antal skott.");
      return;
    }
    if (passCompleted > passAttempts) {
      alert("Lyckade pass kan inte vara fler än antal försök.");
      return;
    }

    const sessionInput: Omit<Session, "id" | "createdAt"> = {
      date,
      shots: { attempts: shotAttempts, onTarget: shotOnTarget },
      passes: { attempts: passAttempts, completed: passCompleted },
      skating: { drill, minutes },
      technique: { stickhandling, dekar, balance },
      note: note.trim() || undefined,
      drills: selectedDrills.length > 0 ? selectedDrills : undefined,
      goalieStats:
        isGoalie && shotsFaced > 0
          ? { shotsFaced, saves: Math.min(saves, shotsFaced) }
          : undefined,
      wellness: showWellness
        ? {
            sleepHours,
            rpe: rpe as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
            soreness: soreness as 1 | 2 | 3 | 4 | 5,
            mood: mood as 1 | 2 | 3 | 4 | 5,
          }
        : undefined,
      videoUrl: videoUrl.trim() || undefined,
      selfReview:
        videoUrl.trim()
          ? { weightTransfer, stickFlex, followThrough, notes: reviewNotes.trim() }
          : undefined,
    };

    const result = addSession(sessionInput);
    setSummary({
      xp: result.xpGained,
      leveledUp: result.leveledUp,
      newLevelName: result.newLevelName,
      newlyUnlocked: result.newlyUnlocked,
    });
    setConfetti(true);
  }

  const drillsInCat = DRILLS.filter((d) => d.category === drillCat);

  return (
    <div className="py-4 sm:py-6 max-w-3xl mx-auto space-y-6">
      <Confetti show={confetti} onDone={() => setConfetti(false)} />

      <div>
        <h1 className="font-display text-3xl text-white">Logga träning</h1>
        <p className="text-white/60 text-sm">
          Fyll i bara det du tränat — tomma fält är okej.
        </p>
      </div>

      {summary ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card p-6 border-neon-gold/50 shadow-gold text-center"
        >
          <div className="text-5xl mb-2">🎉</div>
          <div className="font-display text-2xl text-white">Session loggad!</div>
          <div className="text-neon-gold text-lg mt-2">+{summary.xp} XP</div>
          {summary.leveledUp && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-3 text-neon-cyan font-display text-xl"
            >
              ⬆ LEVEL UP: {summary.newLevelName}
            </motion.div>
          )}
          {summary.newlyUnlocked.length > 0 && (
            <div className="mt-4 space-y-1">
              <div className="text-xs uppercase tracking-widest text-white/50">Nya badges</div>
              {summary.newlyUnlocked.map((id) => {
                const b = BADGES.find((x) => x.id === id);
                if (!b) return null;
                return (
                  <div
                    key={id}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 mx-1"
                  >
                    <span>{b.emoji}</span>
                    <span className="text-sm text-white">{b.name}</span>
                  </div>
                );
              })}
            </div>
          )}
          <div className="mt-6 flex gap-2 justify-center">
            <button
              className="btn-ghost"
              onClick={() => {
                setSummary(null);
                setShotAttempts(0);
                setShotOnTarget(0);
                setPassAttempts(0);
                setPassCompleted(0);
                setMinutes(20);
                setNote("");
                setSelectedDrills([]);
                setVideoUrl("");
              }}
            >
              Logga en till
            </button>
            <button className="btn-primary" onClick={() => nav("/")}>
              Till dashboarden
            </button>
          </div>
        </motion.div>
      ) : (
        <form onSubmit={submit} className="space-y-5">
          {/* Date */}
          <div className="card p-5">
            <label className="label" htmlFor="session-date">Datum</label>
            <input
              id="session-date"
              type="date"
              className="input max-w-xs"
              value={date}
              max={todayISO()}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Shots */}
          <Section
            title="Skott"
            icon="🎯"
            right={
              shotAttempts > 0 && (
                <span className="stat-chip text-neon-cyan">
                  Träffsäkerhet: {shotPct}%
                </span>
              )
            }
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <NumberField label="Antal skott" value={shotAttempts} onChange={setShotAttempts} id="shots-attempts" />
              <NumberField label="På mål" value={shotOnTarget} onChange={setShotOnTarget} max={shotAttempts || undefined} id="shots-on-target" />
            </div>
          </Section>

          {/* Goalie stats */}
          {isGoalie && (
            <Section title="Målvaktsstatistik" icon="🥅"
              right={shotsFaced > 0 && (
                <span className="stat-chip text-neon-cyan">SV% {goalieSavePct}%</span>
              )}
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <NumberField label="Skott mot" value={shotsFaced} onChange={setShotsFaced} id="shots-faced" />
                <NumberField label="Räddningar" value={saves} onChange={(v) => setSaves(Math.min(v, shotsFaced))} max={shotsFaced || undefined} id="saves" />
              </div>
            </Section>
          )}

          {/* Passes */}
          <Section
            title="Passningar"
            icon="🎩"
            right={
              passAttempts > 0 && (
                <span className="stat-chip text-neon-green">Completion: {passPct}%</span>
              )
            }
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <NumberField label="Antal försök" value={passAttempts} onChange={setPassAttempts} id="pass-attempts" />
              <NumberField label="Lyckade pass" value={passCompleted} onChange={setPassCompleted} max={passAttempts || undefined} id="pass-completed" />
            </div>
          </Section>

          {/* Skating */}
          <Section title="Skridsko" icon="⛸️">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Övning</label>
                <div className="grid grid-cols-2 gap-2">
                  {skateDrills.map((d) => (
                    <button
                      type="button"
                      key={d.value}
                      onClick={() => setDrill(d.value)}
                      className={`px-3 py-2 rounded-xl border text-sm font-semibold transition
                        ${drill === d.value ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan" : "bg-ice-800 border-white/10 text-white/70 hover:text-white"}`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
              <NumberField label="Minuter" value={minutes} onChange={setMinutes} step={5} id="skating-minutes" />
            </div>
          </Section>

          {/* Drill picker */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">📚</span>
                <h2 className="font-display text-xl text-white">Drills</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowDrillPicker((v) => !v)}
                className="btn-ghost text-sm"
                aria-label="Välj drills"
              >
                {showDrillPicker ? "Stäng" : "+ Välj drills"}
              </button>
            </div>

            {selectedDrills.length > 0 && (
              <div className="space-y-2 mb-3">
                {selectedDrills.map((sd) => {
                  const dr = DRILLS.find((d) => d.id === sd.drillId);
                  if (!dr) return null;
                  return (
                    <div key={sd.drillId} className="flex items-center justify-between bg-ice-800/60 rounded-xl px-3 py-2">
                      <span className="text-sm text-white">{dr.name}</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          className="input text-center py-1 w-16 text-xs"
                          min={1}
                          value={sd.minutes ?? 10}
                          onChange={(e) =>
                            setSelectedDrills((prev) =>
                              prev.map((x) =>
                                x.drillId === sd.drillId
                                  ? { ...x, minutes: Number(e.target.value) }
                                  : x,
                              ),
                            )
                          }
                          aria-label={`Minuter för ${dr.name}`}
                        />
                        <span className="text-xs text-white/40">min</span>
                        <button
                          type="button"
                          onClick={() => removeDrill(sd.drillId)}
                          className="text-white/30 hover:text-neon-red text-sm transition"
                          aria-label={`Ta bort ${dr.name}`}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {showDrillPicker && (
              <div className="space-y-3">
                <div className="flex gap-2 flex-wrap">
                  {DRILL_CATEGORIES.map((cat) => (
                    <button
                      type="button"
                      key={cat.value}
                      onClick={() => setDrillCat(cat.value)}
                      className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition
                        ${drillCat === cat.value ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan" : "bg-ice-800 border-white/10 text-white/60"}`}
                    >
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>
                <div className="grid gap-2 max-h-52 overflow-y-auto">
                  {drillsInCat.map((dr) => {
                    const isAdded = selectedDrills.some((sd) => sd.drillId === dr.id);
                    return (
                      <button
                        type="button"
                        key={dr.id}
                        onClick={() => isAdded ? removeDrill(dr.id) : addDrill(dr.id)}
                        className={`text-left px-3 py-2 rounded-xl border text-sm transition
                          ${isAdded ? "bg-neon-cyan/15 border-neon-cyan text-neon-cyan" : "bg-ice-800 border-white/10 text-white/70 hover:text-white"}`}
                      >
                        <div>{dr.name}</div>
                        <div className="text-xs opacity-60 mt-0.5">{dr.cues[0]}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Technique */}
          <Section title="Teknik (1-5)" icon="🪄">
            <div className="grid sm:grid-cols-3 gap-4">
              <ScaleField label="Stickhandling" value={stickhandling} onChange={setStickhandling} id="tech-stick" />
              <ScaleField label="Dragningar" value={dekar} onChange={setDekar} id="tech-dekar" />
              <ScaleField label="Balans" value={balance} onChange={setBalance} id="tech-balance" />
            </div>
          </Section>

          {/* Wellness (collapsible) */}
          <div className="card overflow-hidden">
            <button
              type="button"
              className="flex items-center justify-between w-full p-5"
              onClick={() => setShowWellness((v) => !v)}
              aria-expanded={showWellness}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">❤️</span>
                <h2 className="font-display text-xl text-white">Wellness</h2>
              </div>
              <span className="text-white/40 text-sm">{showWellness ? "▲ Stäng" : "▼ Lägg till"}</span>
            </button>
            {showWellness && (
              <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label" htmlFor="wellness-sleep">Sömn (timmar)</label>
                    <input
                      id="wellness-sleep"
                      type="number"
                      min={0}
                      max={24}
                      step={0.5}
                      className="input"
                      value={sleepHours}
                      onChange={(e) => setSleepHours(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="label">RPE (1-10)</label>
                    <div className="flex gap-1 flex-wrap">
                      {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                        <button
                          type="button"
                          key={n}
                          onClick={() => setRpe(n)}
                          className={`w-8 h-8 rounded-lg border text-xs font-bold transition
                            ${rpe === n ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan" : "bg-ice-800 border-white/10 text-white/40"}`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <ScaleField label="Ömhet (1-5)" value={soreness} onChange={setSoreness} id="wellness-soreness" />
                  <ScaleField label="Humör (1-5)" value={mood} onChange={setMood} id="wellness-mood" />
                </div>
              </div>
            )}
          </div>

          {/* Video */}
          <div className="card overflow-hidden">
            <button
              type="button"
              className="flex items-center justify-between w-full p-5"
              onClick={() => setShowVideo((v) => !v)}
              aria-expanded={showVideo}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">🎬</span>
                <h2 className="font-display text-xl text-white">Video</h2>
              </div>
              <span className="text-white/40 text-sm">{showVideo ? "▲ Stäng" : "▼ Bifoga"}</span>
            </button>
            {showVideo && (
              <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4">
                <div>
                  <label className="label" htmlFor="video-url">Video-URL (YouTube/lokal länk)</label>
                  <input
                    id="video-url"
                    type="url"
                    className="input"
                    placeholder="https://..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                  />
                </div>
                {videoUrl && (
                  <div>
                    <div className="text-xs uppercase tracking-widest text-white/40 mb-3">Skott-checklista</div>
                    <div className="space-y-2">
                      {[
                        { key: "weightTransfer", label: "Tyngdöverföring", value: weightTransfer, set: setWeightTransfer },
                        { key: "stickFlex", label: "Klubbflex utnyttjat", value: stickFlex, set: setStickFlex },
                        { key: "followThrough", label: "Follow-through komplett", value: followThrough, set: setFollowThrough },
                      ].map((item) => (
                        <label key={item.key} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.value}
                            onChange={(e) => item.set(e.target.checked)}
                            className="w-4 h-4 accent-neon-cyan"
                            aria-label={item.label}
                          />
                          <span className="text-sm text-white/80">{item.label}</span>
                        </label>
                      ))}
                    </div>
                    <div className="mt-3">
                      <label className="label" htmlFor="video-notes">Anteckningar från videon</label>
                      <textarea
                        id="video-notes"
                        className="input min-h-[80px] resize-y"
                        placeholder="Vad ser du? Vad vill du förbättra?"
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Note */}
          <Section title="Anteckning" icon="📝">
            <textarea
              className="input min-h-[100px] resize-y"
              placeholder="Hur kändes passet? Vad ska du jobba på nästa gång?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Section>

          <div className="sticky bottom-20 sm:bottom-4 z-30 flex gap-2 justify-end">
            <button type="button" className="btn-ghost" onClick={() => nav(-1)}>
              Avbryt
            </button>
            <button type="submit" className="btn-primary">
              Spara session
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function Section({
  title,
  icon,
  right,
  children,
}: {
  title: string;
  icon: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <h2 className="font-display text-xl text-white">{title}</h2>
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  max,
  step = 1,
  id,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  max?: number;
  step?: number;
  id?: string;
}) {
  return (
    <div>
      <label className="label" htmlFor={id}>{label}</label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - step))}
          className="w-10 h-10 rounded-xl bg-ice-800 border border-white/10 text-xl text-white hover:border-neon-cyan/40"
          aria-label={`Minska ${label}`}
        >
          –
        </button>
        <input
          id={id}
          type="number"
          className="input text-center"
          min={0}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        />
        <button
          type="button"
          onClick={() => {
            const next = value + step;
            onChange(max !== undefined ? Math.min(max, next) : next);
          }}
          className="w-10 h-10 rounded-xl bg-ice-800 border border-white/10 text-xl text-white hover:border-neon-cyan/40"
          aria-label={`Öka ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

function ScaleField({
  label,
  value,
  onChange,
  id,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  id?: string;
}) {
  return (
    <div>
      <label className="label" htmlFor={id}>{label}</label>
      <div className="grid grid-cols-5 gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            type="button"
            key={n}
            id={n === 1 ? id : undefined}
            onClick={() => onChange(n)}
            aria-label={`${label}: ${n}`}
            className={`py-2 rounded-lg border text-sm font-bold transition
              ${value >= n ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan" : "bg-ice-800 border-white/10 text-white/40"}`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
