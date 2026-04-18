import { motion } from "framer-motion";
import { rarityStyles, type Badge } from "../lib/badges";

export function BadgeTile({
  badge,
  unlocked,
  onClick,
}: {
  badge: Badge;
  unlocked: boolean;
  onClick?: () => void;
}) {
  const s = rarityStyles[badge.rarity];
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`relative rounded-2xl p-4 text-left w-full border backdrop-blur-sm ring-1
        ${unlocked ? `bg-gradient-to-br ${s.bg} border-white/10 ${s.ring}` : "bg-ice-900/60 border-white/5 ring-transparent grayscale opacity-60"}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl
            ${unlocked ? "bg-white/10" : "bg-black/40"}`}
        >
          {unlocked ? badge.emoji : "🔒"}
        </div>
        <div className="flex-1 min-w-0">
          <div
            className={`font-display text-lg truncate ${unlocked ? s.text : "text-white/60"}`}
          >
            {badge.name}
          </div>
          <div className="text-[11px] uppercase tracking-widest text-white/40">
            {badge.track} · {badge.rarity}
          </div>
        </div>
      </div>
      <div className="mt-3 text-xs text-white/70 leading-snug">
        {badge.description}
      </div>
    </motion.button>
  );
}
