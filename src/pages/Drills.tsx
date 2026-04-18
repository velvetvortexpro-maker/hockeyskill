import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DRILLS, getDrillById } from "../lib/drills";
import type { Drill, DrillCategory, DrillLevel, Position } from "../types";

const CATEGORIES: { value: DrillCategory | "all"; label: string; icon: string }[] = [
  { value: "all", label: "Alla", icon: "🏒" },
  { value: "skating", label: "Skridsko", icon: "⛸️" },
  { value: "shooting", label: "Skott", icon: "🎯" },
  { value: "passing", label: "Passning", icon: "🎩" },
  { value: "puck", label: "Puck", icon: "🖤" },
  { value: "offIce", label: "Off-ice", icon: "🏋️" },
  { value: "goalie", label: "Målvakt", icon: "🥅" },
];

const LEVELS: { value: DrillLevel | "all"; label: string }[] = [
  { value: "all", label: "Alla nivåer" },
  { value: "beginner", label: "Nybörjare" },
  { value: "intermediate", label: "Mellannivå" },
  { value: "advanced", label: "Avancerad" },
];

const POSITIONS: { value: Position | "all"; label: string }[] = [
  { value: "all", label: "Alla positioner" },
  { value: "Forward", label: "Forward" },
  { value: "Center", label: "Center" },
  { value: "Back", label: "Back" },
  { value: "Goalie", label: "Goalie" },
];

function levelColor(level: DrillLevel): string {
  return {
    beginner: "text-neon-green bg-neon-green/10 border-neon-green/30",
    intermediate: "text-neon-gold bg-neon-gold/10 border-neon-gold/30",
    advanced: "text-neon-red bg-neon-red/10 border-neon-red/30",
  }[level];
}

function levelLabel(level: DrillLevel): string {
  return { beginner: "Nybörjare", intermediate: "Mellannivå", advanced: "Avancerad" }[level];
}

function categoryLabel(cat: DrillCategory): string {
  return {
    skating: "Skridsko",
    shooting: "Skott",
    passing: "Passning",
    puck: "Puck",
    offIce: "Off-ice",
    goalie: "Målvakt",
  }[cat];
}

export function Drills() {
  const [category, setCategory] = useState<DrillCategory | "all">("all");
  const [level, setLevel] = useState<DrillLevel | "all">("all");
  const [position, setPosition] = useState<Position | "all">("all");
  const [selected, setSelected] = useState<Drill | null>(null);

  const filtered = DRILLS.filter((d) => {
    if (category !== "all" && d.category !== category) return false;
    if (level !== "all" && d.level !== level) return false;
    if (position !== "all" && !d.position.includes(position as Position)) return false;
    return true;
  });

  return (
    <div className="py-4 sm:py-6 space-y-6">
      <div>
        <h1 className="font-display text-3xl text-white">Drill-bibliotek</h1>
        <p className="text-white/60 text-sm">
          {DRILLS.length} drills med tränar-cues, nivå och progression.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className={`px-3 py-1.5 rounded-xl border text-sm font-medium transition
              ${category === c.value
                ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan"
                : "bg-ice-800 border-white/10 text-white/70 hover:text-white"}`}
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {/* Level + position filter */}
      <div className="flex gap-3 flex-wrap">
        <select
          className="input text-sm py-1.5 px-3 w-auto"
          value={level}
          onChange={(e) => setLevel(e.target.value as DrillLevel | "all")}
        >
          {LEVELS.map((l) => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>
        <select
          className="input text-sm py-1.5 px-3 w-auto"
          value={position}
          onChange={(e) => setPosition(e.target.value as Position | "all")}
        >
          {POSITIONS.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
        <span className="self-center text-white/40 text-sm">{filtered.length} drills</span>
      </div>

      {/* Drill grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((d) => (
          <motion.button
            key={d.id}
            whileHover={{ y: -2 }}
            onClick={() => setSelected(d)}
            className="card p-4 text-left hover:border-neon-cyan/40 transition"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="font-semibold text-white text-sm leading-snug">{d.name}</span>
              <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full border font-medium ${levelColor(d.level)}`}>
                {levelLabel(d.level)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/50">
              <span>{categoryLabel(d.category)}</span>
              <span>•</span>
              <span>{d.defaultDuration} min</span>
              <span>•</span>
              <span>{d.cues.length} cues</span>
            </div>
          </motion.button>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 card p-6 text-center text-white/50">
            Inga drills matchar filtren — prova en annan kombination.
          </div>
        )}
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="card p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h2 className="font-display text-2xl text-white">{selected.name}</h2>
                  <div className="flex items-center gap-2 mt-1 text-xs text-white/50">
                    <span>{categoryLabel(selected.category)}</span>
                    <span>•</span>
                    <span>{selected.defaultDuration} min rekommenderat</span>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full border font-medium shrink-0 ${levelColor(selected.level)}`}>
                  {levelLabel(selected.level)}
                </span>
              </div>

              <div className="mb-4">
                <div className="text-xs uppercase tracking-widest text-white/40 mb-2">Tränar-cues</div>
                <ul className="space-y-2">
                  {selected.cues.map((cue, i) => (
                    <li key={i} className="flex gap-2 text-sm text-white/80">
                      <span className="text-neon-cyan shrink-0 mt-0.5">→</span>
                      <span>{cue}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {selected.progressions.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs uppercase tracking-widest text-white/40 mb-2">Progression</div>
                  <div className="space-y-1">
                    {selected.progressions.map((p) => {
                      const next = getDrillById(p.drillId);
                      if (!next) return null;
                      return (
                        <div key={p.drillId} className="flex items-center gap-2 text-sm text-white/60">
                          <span className="text-neon-gold">→</span>
                          <span>
                            {next.name}{" "}
                            <span className="text-white/30">(efter {p.unlockAfter} pass)</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <div className="text-xs uppercase tracking-widest text-white/40 mb-1">Positioner</div>
                <div className="flex gap-1 flex-wrap">
                  {selected.position.map((p) => (
                    <span key={p} className="text-xs bg-ice-700 text-white/70 px-2 py-0.5 rounded-full">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {selected.videoUrl && (
                <a
                  href={selected.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost text-sm mb-4 inline-flex"
                >
                  🎬 Se video
                </a>
              )}

              <button
                onClick={() => setSelected(null)}
                className="btn-primary w-full"
                aria-label="Stäng drill-detaljer"
              >
                Stäng
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
