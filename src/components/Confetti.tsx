import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo } from "react";

type Props = {
  show: boolean;
  onDone?: () => void;
  duration?: number;
};

const COLORS = ["#00f5ff", "#ffd700", "#ff3860", "#2dd4bf", "#ffffff"];

export function Confetti({ show, onDone, duration = 2200 }: Props) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        rotate: Math.random() * 360,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 0.3,
        size: 6 + Math.random() * 10,
      })),
    [show],
  );

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => onDone?.(), duration);
    return () => clearTimeout(t);
  }, [show, duration, onDone]);

  return (
    <AnimatePresence>
      {show && (
        <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
          {pieces.map((p) => (
            <motion.div
              key={p.id}
              initial={{
                top: "-10%",
                left: `${p.x}%`,
                rotate: p.rotate,
                opacity: 1,
              }}
              animate={{
                top: "110%",
                rotate: p.rotate + 720,
                opacity: [1, 1, 0.7, 0],
              }}
              transition={{
                duration: duration / 1000,
                delay: p.delay,
                ease: "easeIn",
              }}
              style={{
                position: "absolute",
                width: p.size,
                height: p.size * 0.4,
                background: p.color,
                boxShadow: `0 0 8px ${p.color}`,
                borderRadius: 2,
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
