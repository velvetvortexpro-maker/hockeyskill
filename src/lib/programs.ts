import type { Program } from "../types";

export const PROGRAMS: Program[] = [
  // =====================================================================
  // U10 Skridsko-grunder — 8 veckor, 3 pass/vecka
  // =====================================================================
  {
    id: "u10_skating",
    name: "U10 Skridsko-grunder",
    description:
      "Ett 8-veckorsprogram fokuserat på grundläggande skridskoåkning för yngre spelare. Bygger teknik, balans och självförtroende på isen.",
    targetAudience: "U10 (ca 8–10 år)",
    weeks: Array.from({ length: 8 }, (_, wi) => ({
      days: [
        {
          drills: [
            { drillId: "skating_forward", sets: 3, minutes: 5 },
            { drillId: "skating_hockey_stop", sets: 4, minutes: 3 },
            { drillId: "office_ladder_agility", sets: 2, minutes: 5 },
          ],
          focusCue:
            wi < 4
              ? "Knän böjda hela passet — låg tyngdpunkt"
              : "Full extension vid varje steg bakåt",
        },
        {
          drills: [
            { drillId: "skating_backward", sets: 3, minutes: 5 },
            { drillId: "puck_figure8", sets: 3, minutes: 5 },
            { drillId: "pass_forehand", sets: 3, reps: 20 },
          ],
          focusCue: "Ögonen upp — titta på mottagaren, inte på pucken",
        },
        {
          drills: [
            { drillId: "skating_tight_turns", sets: 4, minutes: 4 },
            { drillId: "shot_wrist", sets: 3, reps: 15 },
            { drillId: "office_balance_board", sets: 2, minutes: 5 },
          ],
          focusCue:
            wi < 4
              ? "Sänk dig innan svängen — inte under"
              : "Accelerera UT ur svängen varje gång",
        },
      ],
    })),
  },

  // =====================================================================
  // U14 Shooting Block — 4 veckor, 4 pass/vecka
  // =====================================================================
  {
    id: "u14_shooting",
    name: "U14 Shooting Block",
    description:
      "Intensivt 4-veckorsprogram för att förbättra skottvolym, träffsäkerhet och release-hastighet. Fokus på wrist, snap och in-stride shot.",
    targetAudience: "U14 (ca 12–14 år)",
    weeks: Array.from({ length: 4 }, (_, wi) => ({
      days: [
        {
          drills: [
            { drillId: "shot_wrist", sets: 5, reps: 20 },
            { drillId: "office_shooting_pad", sets: 3, minutes: 10 },
            { drillId: "skating_forward", sets: 2, minutes: 5 },
          ],
          focusCue: "Tyngdöverföring bakfot → framfot vid varje skott",
        },
        {
          drills: [
            { drillId: "shot_snap", sets: 4, reps: 20 },
            { drillId: "shot_backhand", sets: 3, reps: 15 },
            { drillId: "skating_tight_turns", sets: 3, minutes: 5 },
          ],
          focusCue: "Snabb release — pucken ska lämna bladet på under 0,2s",
        },
        {
          drills: [
            { drillId: "shot_in_stride", sets: 4, reps: 15 },
            { drillId: "shot_screen", sets: 3, reps: 10 },
            { drillId: "puck_figure8", sets: 2, minutes: 5 },
          ],
          focusCue: "Skjut utan att stanna rörelsen — full speed",
        },
        {
          drills: [
            { drillId: "shot_one_timer", sets: 3, reps: 12 },
            { drillId: "shot_deflection", sets: 3, reps: 10 },
            { drillId: "office_shooting_pad", sets: 3, minutes: 10 },
          ],
          focusCue:
            wi < 2
              ? "Läs passens vinkel tidigt — flytta fötterna"
              : "Kombinera deflektering med skärmspel",
        },
      ],
    })),
  },

  // =====================================================================
  // U18 Game Pace — 6 veckor, 5 pass/vecka
  // =====================================================================
  {
    id: "u18_game_pace",
    name: "U18 Game Pace",
    description:
      "Träning i matchintensitet. Kombinerar skott, passning, puckhantering och kondition för att förbereda U18-spelare för hög tempo-hockey.",
    targetAudience: "U18 (ca 15–18 år)",
    weeks: Array.from({ length: 6 }, (_, wi) => ({
      days: [
        {
          drills: [
            { drillId: "skating_stride_power", sets: 4, minutes: 5 },
            { drillId: "shot_in_stride", sets: 4, reps: 20 },
            { drillId: "puck_protected", sets: 3, minutes: 5 },
          ],
          focusCue: "Matchhastighet — ingen viloperiod mellan repetitioner",
        },
        {
          drills: [
            { drillId: "skating_transitions", sets: 4, minutes: 5 },
            { drillId: "pass_give_and_go", sets: 4, reps: 15 },
            { drillId: "shot_one_timer", sets: 3, reps: 12 },
          ],
          focusCue: "Kommunicera högt under övningen — precis som i match",
        },
        {
          drills: [
            { drillId: "puck_toe_drag", sets: 3, reps: 15 },
            { drillId: "puck_dangle", sets: 3, minutes: 5 },
            { drillId: "shot_off_foot", sets: 3, reps: 10 },
          ],
          focusCue: "Commit motståndaren — vänta på reaktion",
        },
        {
          drills: [
            { drillId: "skating_crossovers_fwd", sets: 3, minutes: 5 },
            { drillId: "pass_no_look", sets: 3, reps: 10 },
            { drillId: "shot_snap", sets: 4, reps: 20 },
          ],
          focusCue: "Periferseende — se hela planen, inte bara pucken",
        },
        {
          drills: [
            { drillId: "office_shooting_pad", sets: 3, minutes: 10 },
            { drillId: "office_ladder_agility", sets: 3, minutes: 10 },
            { drillId: "office_mobility", sets: 1, minutes: 20 },
          ],
          focusCue:
            wi < 3
              ? "Återhämtning med aktiv mobilitet"
              : "Öka intensiteten på shooting pad-serierna",
        },
      ],
    })),
  },

  // =====================================================================
  // Adult Rec / Beer League — 4 veckor, 2 pass/vecka
  // =====================================================================
  {
    id: "adult_rec",
    name: "Adult Rec / Beer League",
    description:
      "Effektivt 4-veckorsprogram för vuxna spelare med begränsad istid. Fokus på de viktigaste grunderna: skridskoåkning, skott och puckhantering.",
    targetAudience: "Vuxna rekreations- och seriospelare",
    weeks: Array.from({ length: 4 }, (_, wi) => ({
      days: [
        {
          drills: [
            { drillId: "skating_forward", sets: 2, minutes: 8 },
            { drillId: "skating_hockey_stop", sets: 3, minutes: 5 },
            { drillId: "shot_wrist", sets: 4, reps: 20 },
            { drillId: "office_shooting_pad", sets: 2, minutes: 10 },
          ],
          focusCue:
            wi < 2
              ? "Teknik före hastighet — bygg rätt mönster"
              : "Matchtempo på skott — snabb release",
        },
        {
          drills: [
            { drillId: "puck_figure8", sets: 3, minutes: 5 },
            { drillId: "pass_forehand", sets: 3, reps: 20 },
            { drillId: "pass_backhand", sets: 3, reps: 15 },
            { drillId: "office_mobility", sets: 1, minutes: 15 },
          ],
          focusCue: "Ögon upp under puck-handlingen — se isen, inte pucken",
        },
      ],
    })),
  },
];

export function getProgramById(id: string): Program | undefined {
  return PROGRAMS.find((p) => p.id === id);
}

export function totalDays(program: Program): number {
  return program.weeks.reduce((sum, w) => sum + w.days.length, 0);
}
