import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { useMemo, useState } from "react";
import { useApp } from "../components/AppContext";
import { getWeekNumber, mondayOf, thisMondayISO, toISO } from "../lib/dates";
import { computeOverall, computeStats, statLabel, totals } from "../lib/stats";
import { metricLabel, metricUnit, isQualityMetric } from "../lib/goals";
import type { Session, Goal, GoalMetric } from "../types";
import { GoalCard } from "../components/GoalCard";

export function Stats() {
  const { data, addGoal, completeGoal, deleteGoal } = useApp();
  const [showGoalForm, setShowGoalForm] = useState(false);

  const weekly = useMemo(() => buildWeeklyData(data.sessions), [data.sessions]);
  const monthCompare = useMemo(() => monthOverMonth(data.sessions), [data.sessions]);
  const stats = computeStats(data.sessions, data.profile.position);
  const overall = computeOverall(stats, data.profile.position);
  const t = totals(data.sessions);
  const pos = data.profile.position;

  return (
    <div className="py-4 sm:py-6 space-y-6">
      <div>
        <h1 className="font-display text-3xl text-white">Stats & Trender</h1>
        <p className="text-white/60 text-sm">
          Följ din utveckling vecka för vecka och sätt egna mål.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatChip label="Overall" value={overall} accent />
        <StatChip label={statLabel("shot", pos)} value={stats.shot} />
        <StatChip label={statLabel("skating", pos)} value={stats.skating} />
        <StatChip label={statLabel("passing", pos)} value={stats.passing} />
        <StatChip label={statLabel("technique", pos)} value={stats.technique} />
        <StatChip label={statLabel("tackling", pos)} value={stats.tackling} />
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-display text-xl text-white">Stats per vecka</h2>
          <div className="text-xs text-white/50">Beräknat från loggad data</div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weekly}>
              <CartesianGrid stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="label" stroke="#ffffff66" fontSize={11} />
              <YAxis stroke="#ffffff66" fontSize={11} domain={[0, 99]} width={30} />
              <Tooltip
                contentStyle={{
                  background: "#12121cee",
                  border: "1px solid #ffffff22",
                  borderRadius: 12,
                  color: "#fff",
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="shot" name={statLabel("shot", pos)} stroke="#00f5ff" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="skating" name={statLabel("skating", pos)} stroke="#ffd700" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="passing" name={statLabel("passing", pos)} stroke="#2dd4bf" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="technique" name={statLabel("technique", pos)} stroke="#ff8c42" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="tackling" name={statLabel("tackling", pos)} stroke="#ff3860" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-4">
          <h2 className="font-display text-xl text-white mb-2">Volym per vecka</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly}>
                <CartesianGrid stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="label" stroke="#ffffff66" fontSize={11} />
                <YAxis stroke="#ffffff66" fontSize={11} width={30} />
                <Tooltip
                  contentStyle={{
                    background: "#12121cee",
                    border: "1px solid #ffffff22",
                    borderRadius: 12,
                    color: "#fff",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="shotsCount" name="Skott" fill="#00f5ff" />
                <Bar dataKey="passesCount" name="Passningar" fill="#2dd4bf" />
                <Bar dataKey="skatingMinutes" name="Skridsko-min" fill="#ffd700" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-4">
          <h2 className="font-display text-xl text-white mb-3">Förra månaden vs. nu</h2>
          <div className="grid grid-cols-2 gap-3">
            <CompareRow label="Sessioner" a={monthCompare.prev.sessions} b={monthCompare.now.sessions} />
            <CompareRow label="Skott" a={monthCompare.prev.shots} b={monthCompare.now.shots} />
            <CompareRow label="Passningar" a={monthCompare.prev.passes} b={monthCompare.now.passes} />
            <CompareRow label="Skridsko-min" a={monthCompare.prev.skatingMinutes} b={monthCompare.now.skatingMinutes} />
          </div>
          <div className="mt-4 text-xs text-white/50">
            Totalt: {t.shots.toLocaleString("sv-SE")} skott •{" "}
            {t.passes.toLocaleString("sv-SE")} pass •{" "}
            {t.skatingMinutes.toLocaleString("sv-SE")} min skridsko
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-white">Dina mål</h2>
          <button onClick={() => setShowGoalForm((v) => !v)} className="btn-ghost">
            {showGoalForm ? "Stäng" : "+ Nytt mål"}
          </button>
        </div>

        {showGoalForm && (
          <CustomGoalForm
            onAdd={(g) => {
              addGoal(g);
              setShowGoalForm(false);
            }}
          />
        )}

        {data.goals.length === 0 ? (
          <div className="card p-4 text-sm text-white/70">
            Inga mål än. Lägg till ett förslag från dashboarden eller skapa eget.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {data.goals.map((g) => (
              <GoalCard
                key={g.id}
                goal={g}
                sessions={data.sessions}
                onComplete={completeGoal}
                onDelete={deleteGoal}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatChip({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={`card p-3 text-center ${accent ? "border-neon-cyan/40 shadow-glow" : ""}`}>
      <div className="text-[10px] uppercase tracking-widest text-white/50">{label}</div>
      <div className={`font-display text-3xl mt-1 ${accent ? "text-neon-cyan" : "text-white"}`}>
        {value}
      </div>
    </div>
  );
}

function CompareRow({ label, a, b }: { label: string; a: number; b: number }) {
  const diff = b - a;
  const pct = a === 0 ? (b > 0 ? 100 : 0) : Math.round(((b - a) / a) * 100);
  const up = diff >= 0;
  return (
    <div className="bg-ice-800/60 rounded-xl p-3 border border-white/5">
      <div className="text-[10px] uppercase tracking-widest text-white/50">{label}</div>
      <div className="font-display text-xl text-white mt-0.5">{b}</div>
      <div className={`text-xs ${up ? "text-neon-green" : "text-neon-red"}`}>
        {up ? "▲" : "▼"} {up ? "+" : ""}{diff} ({up ? "+" : ""}{pct}%)
      </div>
      <div className="text-[10px] text-white/40 mt-0.5">Förra månaden: {a}</div>
    </div>
  );
}

const VOLUME_METRICS: GoalMetric[] = ["shots", "passes", "skatingMinutes", "sessions"];
const QUALITY_METRICS: GoalMetric[] = ["shotAccuracy", "passCompletion"];

function CustomGoalForm({ onAdd }: { onAdd: (g: Omit<Goal, "id">) => void }) {
  const [title, setTitle] = useState("");
  const [metric, setMetric] = useState<GoalMetric>("shots");
  const [target, setTarget] = useState(100);

  const isQuality = isQualityMetric(metric);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim() || target <= 0) return;
        onAdd({ title: title.trim(), metric, target, weekStart: thisMondayISO() });
        setTitle("");
        setTarget(100);
      }}
      className="card p-4 space-y-3"
    >
      <div className="grid sm:grid-cols-[1fr_auto_auto_auto] gap-3 items-end">
        <div>
          <label className="label" htmlFor="goal-title">Titel</label>
          <input
            id="goal-title"
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="T.ex. Krossa veckans skottvolym"
          />
        </div>
        <div>
          <label className="label" htmlFor="goal-metric">Typ</label>
          <select
            id="goal-metric"
            className="input"
            value={metric}
            onChange={(e) => {
              const m = e.target.value as GoalMetric;
              setMetric(m);
              setTarget(isQualityMetric(m) ? 60 : 100);
            }}
          >
            <optgroup label="Volym">
              {VOLUME_METRICS.map((m) => (
                <option key={m} value={m}>{metricLabel(m)}</option>
              ))}
            </optgroup>
            <optgroup label="Kvalitet">
              {QUALITY_METRICS.map((m) => (
                <option key={m} value={m}>{metricLabel(m)}</option>
              ))}
            </optgroup>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="goal-target">
            Mål {isQuality ? metricUnit(metric) : ""}
          </label>
          <input
            id="goal-target"
            type="number"
            className="input"
            value={target}
            min={1}
            max={isQuality ? 100 : undefined}
            onChange={(e) => setTarget(Number(e.target.value) || 0)}
          />
        </div>
        <button className="btn-primary" aria-label="Lägg till mål">Lägg till</button>
      </div>
      {isQuality && (
        <div className="text-xs text-neon-cyan bg-neon-cyan/10 rounded-lg px-3 py-2">
          Kvalitetsmål: mäts som genomsnitt denna vecka. {metric === "shotAccuracy" ? "60% är bra, 70% är excellent." : "80% är bra, 90% är excellent."}
        </div>
      )}
    </form>
  );
}

type WeekPoint = {
  label: string;
  weekStart: string;
  shot: number;
  skating: number;
  passing: number;
  technique: number;
  tackling: number;
  shotsCount: number;
  passesCount: number;
  skatingMinutes: number;
};

function buildWeeklyData(sessions: Session[]): WeekPoint[] {
  if (sessions.length === 0) {
    const points: WeekPoint[] = [];
    const m = mondayOf(new Date());
    for (let i = 7; i >= 0; i--) {
      const d = new Date(m);
      d.setDate(d.getDate() - i * 7);
      points.push({
        label: `v${getWeekNumber(d)}`,
        weekStart: toISO(d),
        shot: 0, skating: 0, passing: 0, technique: 0, tackling: 0,
        shotsCount: 0, passesCount: 0, skatingMinutes: 0,
      });
    }
    return points;
  }

  const byWeek = new Map<string, Session[]>();
  for (const s of sessions) {
    const m = toISO(mondayOf(new Date(s.date)));
    if (!byWeek.has(m)) byWeek.set(m, []);
    byWeek.get(m)!.push(s);
  }

  const latestMondayISO = toISO(mondayOf(new Date(sessions[sessions.length - 1].date)));
  const weeks: string[] = [];
  const base = new Date(latestMondayISO);
  for (let i = 7; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(d.getDate() - i * 7);
    weeks.push(toISO(d));
  }

  const sortedByDate = [...sessions].sort((a, b) => a.date.localeCompare(b.date));
  return weeks.map((w) => {
    const endOfWeek = new Date(w);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    const cumulative = sortedByDate.filter((s) => new Date(s.date) <= endOfWeek);
    const ratings = computeStats(cumulative);
    const thisWeek = byWeek.get(w) || [];
    return {
      label: `v${getWeekNumber(new Date(w))}`,
      weekStart: w,
      ...ratings,
      shotsCount: thisWeek.reduce((a, s) => a + s.shots.attempts, 0),
      passesCount: thisWeek.reduce((a, s) => a + s.passes.attempts, 0),
      skatingMinutes: thisWeek.reduce((a, s) => a + s.skating.minutes, 0),
    };
  });
}

function monthOverMonth(sessions: Session[]) {
  const now = new Date();
  const startOfThis = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfPrev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const inThis = sessions.filter(
    (s) => new Date(s.date) >= startOfThis && new Date(s.date) <= now,
  );
  const inPrev = sessions.filter(
    (s) => new Date(s.date) >= startOfPrev && new Date(s.date) < startOfThis,
  );
  return { now: totals(inThis), prev: totals(inPrev) };
}
