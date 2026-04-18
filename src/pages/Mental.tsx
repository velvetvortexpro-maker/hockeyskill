import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Exercise = {
  id: string;
  title: string;
  icon: string;
  duration: string;
  description: string;
  steps: string[];
};

const EXERCISES: Exercise[] = [
  {
    id: "breathing_478",
    title: "4-7-8 Andning",
    icon: "🌬️",
    duration: "3 min",
    description:
      "Aktiverar parasympatiska nervsystemet. Perfekt före match eller för att lugna nervsystemet efter intensiv träning.",
    steps: [
      "Sitt bekvämt med rak rygg.",
      "Andas in genom näsan i 4 sekunder.",
      "Håll andan i 7 sekunder.",
      "Andas ut långsamt genom munnen i 8 sekunder.",
      "Upprepa 4–6 cykler.",
      "Avsluta med 3 normala andetag.",
    ],
  },
  {
    id: "visualization",
    title: "Visualisering av matchsituation",
    icon: "🎬",
    duration: "5 min",
    description:
      "Hjärnan kan inte skilja på tydlig visualisering och verklighet. Bygg rätt mönster mentalt.",
    steps: [
      "Hitta ett tyst ställe, sätt dig bekvämt.",
      "Blunda och ta 3 djupa andetag.",
      "Se dig själv på isen — i detalj: bandet, ljuset, lukten.",
      "Spela upp en situation du vill bli bättre på (t.ex. wrist shot mot bakhand).",
      "Känn rörelserna i kroppen — skate-push, stick-flex, follow-through.",
      "Visualisera resultatet: pucken i nätet, kroppen i rätt position.",
      "Upprepa sekvensen 3–5 gånger i din mentala film.",
    ],
  },
  {
    id: "focus_routine",
    title: "Fokuspunkt-rutin före pass",
    icon: "🎯",
    duration: "2 min",
    description:
      "En kort pre-pass rutin som aktiverar fokus och sätter intentionen för träningen.",
    steps: [
      "Välj ETT fokusområde för passet (t.ex. 'hands soft' eller 'head up').",
      "Stå stilla i 30 sekunder, blunda.",
      "Repetera ditt fokusord 5 gånger tyst.",
      "Öppna ögonen och börja passet med intentionen aktiv.",
    ],
  },
  {
    id: "post_game_reflection",
    title: "Post-match reflektionstemplate",
    icon: "📋",
    duration: "5 min",
    description:
      "Strukturerad reflektion omvandlar erfarenheter till lärdom. Gör det inom 2 timmar efter match.",
    steps: [
      "Skriv ner: Vad gick bra i matchen? (minst 2 saker)",
      "Skriv ner: Vad ville jag ha gjort annorlunda? (max 2 saker)",
      "Välj EN sak att fokusera på i nästa träning.",
      "Avsluta med: 'Jag är stolt över att jag...' (ett komplett påstående).",
    ],
  },
  {
    id: "mental_cue_cards",
    title: "Mental-cue-kort",
    icon: "🃏",
    duration: "1 min",
    description:
      "Korta, enkla ord eller fraser som aktiverar rätt rörelsemönster under press.",
    steps: [
      "Välj ett cue-ord för din viktigaste rörelsedetalj just nu (t.ex. 'knän böjda').",
      "Koppla ordet till en fysisk känsla — hur känns det korrekt?",
      "Öva att säga ordet tyst precis INNAN du utför rörelsen.",
      "Exempel: 'hands soft' → mjuka händer vid puck → bättre kontroll.",
      "Byt ut cue-ordet när rörelsen blivit automatisk.",
    ],
  },
  {
    id: "pre_shift_mantra",
    title: "Pre-shift mantra-byggare",
    icon: "⚡",
    duration: "2 min",
    description:
      "Bygg ditt eget personliga pre-shift mantra för att komma i rätt mentalt tillstånd inför varje shift.",
    steps: [
      "Välj tre ord som beskriver hur du vill spela: t.ex. 'Snabb. Precis. Modig.'",
      "Säg mantrat tyst tre gånger precis innan du hoppar på isen.",
      "Varje ord ska kopplas till en konkret känsla eller rörelse.",
      "Konsistens är nyckeln — använd SAMMA mantra varje shift.",
      "Revidera mantrat var 4:e vecka baserat på vad du jobbar på.",
    ],
  },
];

export function Mental() {
  const [active, setActive] = useState<Exercise | null>(null);
  const [done, setDone] = useState<Set<string>>(new Set());

  function markDone(id: string) {
    setDone((prev) => new Set([...prev, id]));
    setActive(null);
  }

  return (
    <div className="py-4 sm:py-6 space-y-6">
      <div>
        <h1 className="font-display text-3xl text-white">Mental träning</h1>
        <p className="text-white/60 text-sm">
          6 övningar för fokus, visualisering och mental styrka. Genomförda övningar ger Mind Game-badge.
        </p>
        {done.size > 0 && (
          <div className="mt-2 text-neon-cyan text-sm">
            ✓ {done.size} / {EXERCISES.length} övningar gjorda idag
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {EXERCISES.map((ex) => {
          const isDone = done.has(ex.id);
          return (
            <motion.button
              key={ex.id}
              whileHover={{ y: -2 }}
              onClick={() => setActive(ex)}
              className={`card p-5 text-left transition ${isDone ? "border-neon-green/40 bg-neon-green/5" : "hover:border-neon-cyan/40"}`}
              aria-label={`Starta övning: ${ex.title}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{ex.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg text-white">{ex.title}</h3>
                    {isDone && <span className="text-neon-green text-sm">✓</span>}
                  </div>
                  <div className="text-xs text-white/50 mt-0.5">{ex.duration}</div>
                  <p className="text-sm text-white/70 mt-2 line-clamp-2">{ex.description}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="card p-5 border-neon-cyan/20">
        <h2 className="font-display text-xl text-white mb-2">Snabb-tips</h2>
        <div className="space-y-2 text-sm text-white/70">
          <div className="flex gap-2">
            <span className="text-neon-cyan shrink-0">→</span>
            <span>Mental träning är träning — boka tid för det, gör det inte bara "när du känner för det".</span>
          </div>
          <div className="flex gap-2">
            <span className="text-neon-cyan shrink-0">→</span>
            <span>Konsistens slår intensitet: 5 minuter dagligen är bättre än 30 minuter en gång i veckan.</span>
          </div>
          <div className="flex gap-2">
            <span className="text-neon-cyan shrink-0">→</span>
            <span>Kombinera visualisering med fysisk träning: visualisera skottet, skjut sedan 20 gånger.</span>
          </div>
        </div>
      </div>

      {/* Exercise modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="card p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{active.icon}</span>
                <div>
                  <h2 className="font-display text-2xl text-white">{active.title}</h2>
                  <div className="text-xs text-white/50">{active.duration}</div>
                </div>
              </div>

              <p className="text-white/70 text-sm mb-5">{active.description}</p>

              <div className="mb-6">
                <div className="text-xs uppercase tracking-widest text-white/40 mb-3">Steg för steg</div>
                <ol className="space-y-3">
                  {active.steps.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm text-white/80">
                      <span className="text-neon-cyan font-bold shrink-0 mt-0.5">{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex gap-2">
                <button
                  className="btn-ghost flex-1"
                  onClick={() => setActive(null)}
                >
                  Stäng
                </button>
                <button
                  className="btn-primary flex-1"
                  onClick={() => markDone(active.id)}
                >
                  ✓ Klar!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
