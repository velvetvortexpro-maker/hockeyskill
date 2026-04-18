import type { SkillTest } from "../types";

export const SKILL_TESTS: SkillTest[] = [
  {
    id: "puck_figure8_timed",
    name: "Puck-handling figur-8 på tid",
    protocol: [
      "Placera två koner 1,5 meter isär.",
      "Starta stopptiden när du börjar röra pucken.",
      "Gör 5 kompletta figur-8-varv runt konerna.",
      "Stoppa när du avslutar sista varvet.",
      "Notera bästa av 3 försök (sekunder, lägre = bättre).",
    ],
    scoring: "time",
    recommendedFrequencyDays: 28,
  },
  {
    id: "shooting_zones",
    name: "20 skott från 5 zoner (träffsäkerhet %)",
    protocol: [
      "Dela upp målskjutningsplatsen i 5 zoner: vänster sida, höger sida, mittmitten, vänster backhand-vinkel, höger backhand-vinkel.",
      "Skjut 4 skott från varje zon = 20 skott totalt.",
      "Varje skott som träffar nätet räknas.",
      "Beräkna: (skott på mål / 20) × 100 = poäng i %.",
      "Notera antal på mål och slutlig procent.",
    ],
    scoring: "percent",
    recommendedFrequencyDays: 28,
  },
  {
    id: "forward_backward_loop",
    name: "Framåt + bakåt skating loop på tid",
    protocol: [
      "Starta vid blålinjen nära bänken.",
      "Åk framåt till motståndarens blålinje.",
      "Vänd och åk bakåt till startlinjen.",
      "Upprepa 3 gånger (totalt 6 längder).",
      "Stopptiden efter sista längden. Bästa av 2 försök.",
    ],
    scoring: "time",
    recommendedFrequencyDays: 28,
  },
  {
    id: "stop_start_sprint",
    name: "Stop-and-start sprint",
    protocol: [
      "Placera koner vid blålinjen och mittlinjen (ca 15 meter).",
      "Starta vid blålinjen, sprint till mittlinjen.",
      "Full hockey-stopp vid mittlinjen.",
      "Sprint tillbaka till blålinjen — full hockey-stopp.",
      "Bästa av 3 försök (sekunder, lägre = bättre).",
    ],
    scoring: "time",
    recommendedFrequencyDays: 28,
  },
  {
    id: "transition_test",
    name: "Transition test (framåt–bakåt–framåt)",
    protocol: [
      "Starta vid ena blålinjen, åk framåt till motståndarens blålinje.",
      "Pivot bakåt vid blålinjen — utan att stoppa.",
      "Åk bakåt till mittlinjen.",
      "Pivot framåt igen vid mittlinjen.",
      "Sprint till startblålinjen. Notera tid. Bästa av 2 försök.",
    ],
    scoring: "time",
    recommendedFrequencyDays: 28,
  },
  {
    id: "goalie_test",
    name: "Goalietest – räddningsprocent på 20 skott",
    protocol: [
      "Skyttare skjuter 20 skott från 5 positioner (4 skott per position): vänster wings, höger wings, mittcentrum, vänster circle, höger circle.",
      "Skyttarna meddelar position och skotttyp i förväg (wrist/snap).",
      "Räkna antal räddningar av 20.",
      "Beräkna: (räddningar / 20) × 100 = save% i testet.",
      "Godkänd: ≥ 70% (14 av 20). Excellent: ≥ 85% (17 av 20).",
    ],
    scoring: "percent",
    recommendedFrequencyDays: 28,
  },
];

export function getSkillTestById(id: string): SkillTest | undefined {
  return SKILL_TESTS.find((t) => t.id === id);
}

export function scoringLabel(scoring: SkillTest["scoring"]): string {
  return { time: "Tid (sek)", count: "Antal", percent: "Procent (%)" }[scoring];
}

export function scoringUnit(scoring: SkillTest["scoring"]): string {
  return { time: "s", count: "st", percent: "%" }[scoring];
}

export function isImprovement(
  scoring: SkillTest["scoring"],
  newScore: number,
  prevScore: number,
): boolean {
  if (scoring === "time") return newScore < prevScore;
  return newScore > prevScore;
}
