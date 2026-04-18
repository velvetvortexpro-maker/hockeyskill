import { useMemo } from "react";
import { useApp } from "../components/AppContext";
import { BADGES } from "../lib/badges";
import { BadgeTile } from "../components/BadgeTile";

export function Badges() {
  const { data } = useApp();

  const { unlocked, locked, volume, mastery } = useMemo(() => {
    const unlocked = BADGES.filter((b) => data.unlockedBadges[b.id]);
    const locked = BADGES.filter((b) => !data.unlockedBadges[b.id]);
    const volume = unlocked.filter((b) => b.track === "volume");
    const mastery = unlocked.filter((b) => b.track === "mastery");
    return { unlocked, locked, volume, mastery };
  }, [data.unlockedBadges]);

  const pct = Math.round((unlocked.length / BADGES.length) * 100);

  return (
    <div className="py-4 sm:py-6 space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl text-white">Badges</h1>
          <p className="text-white/60 text-sm">
            Lås upp achievements genom att logga träning.
          </p>
        </div>
        <div className="card p-3 text-center">
          <div className="text-[10px] uppercase tracking-widest text-white/50">
            Upplåst
          </div>
          <div className="font-display text-2xl text-neon-gold">
            {unlocked.length}/{BADGES.length}
          </div>
          <div className="text-xs text-white/50">{pct}%</div>
        </div>
      </div>

      {volume.length > 0 && (
        <section>
          <h2 className="font-display text-xl text-white mb-3">
            Volym ({volume.length})
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {volume.map((b) => (
              <BadgeTile key={b.id} badge={b} unlocked />
            ))}
          </div>
        </section>
      )}

      {mastery.length > 0 && (
        <section>
          <h2 className="font-display text-xl text-white mb-3">
            Mastery ({mastery.length})
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {mastery.map((b) => (
              <BadgeTile key={b.id} badge={b} unlocked />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-display text-xl text-white mb-3">
          Låsta ({locked.length})
        </h2>
        {locked.length === 0 ? (
          <div className="card p-4 text-sm text-white/70">
            🏆 Du har låst upp alla! Legendstatus.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {locked.map((b) => (
              <BadgeTile key={b.id} badge={b} unlocked={false} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
