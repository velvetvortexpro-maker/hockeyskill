import { motion } from "framer-motion";
import type { Position, Stats } from "../types";
import { computeOverall } from "../lib/stats";

type Props = {
  name: string;
  position: Position;
  emoji: string;
  jerseyNumber: number;
  stats: Stats;
  levelName: string;
  photoUrl?: string;
};

const positionAbbr: Record<Position, string> = {
  Center: "C",
  Back: "D",
  Forward: "LW/RW",
  Goalie: "G",
};

export function PlayerCard({
  name,
  position,
  emoji,
  jerseyNumber,
  stats,
  levelName,
  photoUrl,
}: Props) {
  const overall = computeOverall(stats, position);
  const gold = overall >= 85;

  return (
    <motion.div
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ y: -4, rotate: -0.3 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className="relative w-full max-w-[260px] mx-auto select-none"
      style={{ aspectRatio: "3 / 4.2" }}
    >
      {/* Outer card frame */}
      <div
        className={`absolute inset-0 rounded-2xl overflow-hidden border-2
          ${gold ? "border-yellow-400 shadow-[0_0_50px_rgba(255,215,0,0.5)]" : "border-blue-400/60 shadow-[0_0_50px_rgba(0,150,255,0.35)]"}`}
      >
        {/* Card background */}
        <div
          className={`absolute inset-0 ${
            gold
              ? "bg-gradient-to-b from-yellow-950 via-yellow-900 to-yellow-950"
              : "bg-gradient-to-b from-blue-950 via-[#0d1b3e] to-blue-950"
          }`}
        />

        {/* Subtle diagonal shine lines */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.3) 40px, rgba(255,255,255,0.3) 41px)",
          }}
        />

        {/* Holo shine sweep */}
        <div className="holo absolute inset-0 z-10 pointer-events-none" />

        {/* ── TOP SECTION: Photo area ── */}
        <div className="relative" style={{ height: "56%" }}>
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={name}
              className="absolute inset-0 w-full h-full object-cover object-top"
              style={{ filter: "brightness(0.85) contrast(1.1)" }}
            />
          ) : (
            <div className="absolute inset-0 flex items-end justify-center pb-2">
              <span className="text-[90px] leading-none drop-shadow-2xl">{emoji || "🏒"}</span>
            </div>
          )}

          {/* Fade to bottom */}
          <div
            className="absolute inset-0"
            style={{
              background: gold
                ? "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 40%, rgba(30,15,0,0.95) 100%)"
                : "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 40%, rgba(5,10,30,0.95) 100%)",
            }}
          />

          {/* Rating + position (top-left) */}
          <div className="absolute top-3 left-3 z-20">
            <div
              className="font-display leading-none"
              style={{
                fontSize: "3.2rem",
                color: gold ? "#fde68a" : "#e0f2fe",
                textShadow: "0 2px 12px rgba(0,0,0,0.9)",
              }}
            >
              {overall}
            </div>
            <div
              className="font-bold tracking-widest"
              style={{
                fontSize: "0.75rem",
                color: gold ? "#fcd34d" : "#7dd3fc",
                textShadow: "0 1px 6px rgba(0,0,0,0.8)",
              }}
            >
              {positionAbbr[position]}
            </div>
          </div>

          {/* Level + jersey (top-right) */}
          <div className="absolute top-3 right-3 z-20 text-right">
            <div className="text-[9px] uppercase tracking-widest text-white/50">Level</div>
            <div
              className="font-display text-sm"
              style={{ color: gold ? "#fcd34d" : "#7dd3fc" }}
            >
              {levelName}
            </div>
            <div className="text-[10px] text-white/40 mt-0.5">#{jerseyNumber}</div>
          </div>
        </div>

        {/* ── BOTTOM SECTION ── */}
        <div
          className="relative flex flex-col px-4 pt-2 pb-3 z-20"
          style={{ height: "44%" }}
        >
          {/* Player name */}
          <div className="text-center mb-2">
            <div
              className="font-display tracking-[0.12em] truncate"
              style={{
                fontSize: "1.2rem",
                color: gold ? "#fde68a" : "#f0f9ff",
                textShadow: gold
                  ? "0 0 20px rgba(255,215,0,0.6)"
                  : "0 0 20px rgba(100,200,255,0.4)",
              }}
            >
              {name.toUpperCase()}
            </div>
          </div>

          {/* Divider */}
          <div
            className="h-px mb-3"
            style={{
              background: gold
                ? "linear-gradient(90deg, transparent, #fcd34d80, transparent)"
                : "linear-gradient(90deg, transparent, #60a5fa60, transparent)",
            }}
          />

          {/* Stats: 3 left | 2 right */}
          <div className="flex justify-between items-start flex-1">
            <div className="space-y-1.5">
              {(
                [
                  { key: "shot", label: "SKO" },
                  { key: "skating", label: "SKR" },
                  { key: "passing", label: "PAS" },
                ] as { key: keyof Stats; label: string }[]
              ).map(({ key, label }) => (
                <div key={key} className="flex items-center gap-2">
                  <span
                    className="font-display text-base leading-none w-7 text-right"
                    style={{ color: gold ? "#fde68a" : "#e0f2fe" }}
                  >
                    {stats[key]}
                  </span>
                  <span className="text-[10px] font-bold tracking-widest text-white/50">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Vertical divider */}
            <div
              className="w-px self-stretch mx-1"
              style={{
                background: gold
                  ? "linear-gradient(to bottom, transparent, #fcd34d50, transparent)"
                  : "linear-gradient(to bottom, transparent, #60a5fa40, transparent)",
              }}
            />

            <div className="space-y-1.5">
              {(
                [
                  { key: "technique", label: "TEK" },
                  { key: "tackling", label: "TAC" },
                ] as { key: keyof Stats; label: string }[]
              ).map(({ key, label }) => (
                <div key={key} className="flex items-center gap-2">
                  <span
                    className="font-display text-base leading-none w-7 text-right"
                    style={{ color: gold ? "#fde68a" : "#e0f2fe" }}
                  >
                    {stats[key]}
                  </span>
                  <span className="text-[10px] font-bold tracking-widest text-white/50">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-1">
            <span
              className="text-[9px] font-bold tracking-[0.2em] uppercase"
              style={{ color: gold ? "#fcd34d60" : "#60a5fa50" }}
            >
              HST Hockey
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
