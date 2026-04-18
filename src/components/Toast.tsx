import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

export type Toast = {
  id: string;
  title: string;
  body?: string;
  emoji?: string;
  tone?: "info" | "success" | "level" | "badge";
};

export function ToastStack({
  toasts,
  dismiss,
}: {
  toasts: Toast[];
  dismiss: (id: string) => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-[90] flex flex-col gap-2 max-w-sm w-[92vw] sm:w-auto">
      <AnimatePresence>
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} dismiss={dismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastCard({
  toast,
  dismiss,
}: {
  toast: Toast;
  dismiss: (id: string) => void;
}) {
  useEffect(() => {
    const t = setTimeout(() => dismiss(toast.id), 4200);
    return () => clearTimeout(t);
  }, [toast.id, dismiss]);

  const toneClass =
    toast.tone === "level"
      ? "border-neon-gold/60 shadow-gold"
      : toast.tone === "badge"
        ? "border-fuchsia-400/40"
        : toast.tone === "success"
          ? "border-neon-green/40"
          : "border-neon-cyan/40 shadow-glow";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.9 }}
      onClick={() => dismiss(toast.id)}
      className={`cursor-pointer card p-4 flex gap-3 items-start ${toneClass}`}
    >
      <div className="text-2xl">{toast.emoji || "✨"}</div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-white">{toast.title}</div>
        {toast.body && (
          <div className="text-sm text-white/70 mt-0.5">{toast.body}</div>
        )}
      </div>
    </motion.div>
  );
}
