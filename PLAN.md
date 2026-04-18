# Hockey Skills Tracker — PLAN.md

## Produktmål

Hjälpa hockeyspelare att faktiskt bli bättre — inte bara logga volym. Appen kombinerar gamifiering (XP, levels, badges) med verktyg för kvalitetsträning: strukturerade drill-cues, objektiva skill-tester, program, matchlogg och mental träning.

## Målgrupp

- **Spelare U10–vuxen** (rekreation + seriös)
- **Tränare** som vill följa spelarnas progression och ge feedback
- **Föräldrar** till unga spelare som hjälper till att logga träning

## Filosofi

> **Kvalitet över volym.** Belöna träffsäkerhet och completion — inte bara antal skott och passningar.

Konkreta val utifrån filosofin:
- Tech-sliders bidrar maximalt 32 XP (ej grindbart via 5/5 varje pass)
- +20% XP-bonus för shot accuracy ≥ 60% och pass completion ≥ 80%
- Coach-verifierade sessioner ger +15% XP
- Mastery-badges kräver objektiva testresultat, inte bara volym
- Tackling beräknas från riktiga 1v1-data; Goalie får räddningsprocent istället

## Arkitektur (v1)

```
src/
  components/    React-komponenter (AppContext, Layout, Cards, etc.)
  lib/           Ren business-logik (ingen React)
    badges.ts    Badge-definitioner + evaluering
    dates.ts     Datumhjälpfunktioner + streak-beräkning
    drills.ts    Drill-katalog (41 drills)
    goals.ts     Veckomål + kvalitetsmål
    programs.ts  Träningsprogram (4 st)
    skillTests.ts Färdighetstester (6 st)
    stats.ts     Rating-beräkning (1-99)
    storage.ts   localStorage + schemamigrering
    supabase.ts  Cloud sync (valfritt)
    useAppData.ts Huvud-hook med all app-state
    xp.ts        XP-formler + level-system
    i18n/        Translations (sv.json, en.json)
    __tests__/   Unit-tester (vitest)
  pages/         Sidor (en per route)
  types.ts       Alla TypeScript-typer
```

## Modul-karta

| Modul | Syfte |
|-------|-------|
| types.ts | Centrala typer — Session, Goal, Drill, Program, etc. |
| storage.ts | Ladda/spara AppData med schema-migration |
| stats.ts | Beräkna 1-99 ratings från sessionsdata |
| xp.ts | XP per session med kvalitetsmultiplikator |
| goals.ts | Volym- och kvalitetsmål |
| badges.ts | 15 badges (volume + mastery track) |
| dates.ts | Streak med vilodagar, ISO-datum-helpers |
| drills.ts | 41 drills med coaching-cues |
| programs.ts | 4 program (U10/U14/U18/Adult) |
| skillTests.ts | 6 objektiva tester med protokoll |

## Routes

| Route | Sida |
|-------|------|
| / | Dashboard |
| /logga | LogTraining |
| /stats | Stats & Trender |
| /badges | Badge-samling |
| /installningar | Inställningar |
| /drills | Drill-bibliotek |
| /program | Träningsprogram |
| /tester | Färdighetstester |
| /match | Matchlogg |
| /mental | Mental träning |

## Dataflöde

```
useAppData (hook)
  ↓ läser/skriver
localStorage (primär)  ←→  Supabase (valfri sync)
  ↓ via AppCtx.Provider
Alla sidor/komponenter
```

## Roadmap

### v1 (Implementerat)
- [x] Dashboard med XP, streak, mål, senaste sessioner
- [x] LogTraining med drill-picker, wellness, video-bifogning
- [x] Stats med veckotrend, månadskomparison, kvalitetsmål
- [x] Badges (10 volym + 5 mastery)
- [x] 41 drills med coaching-cues
- [x] 4 träningsprogram
- [x] 6 objektiva färdighetstester med progressionsgraf
- [x] Matchlogg med reflektion (+50 XP)
- [x] Mental träning (6 övningar)
- [x] Vilodag-streak (bryter inte streak)
- [x] Goalie-position med räddningsprocent
- [x] Schema-migration (v1→v2 bakåtkompatibel)
- [x] i18n-struktur (sv + en JSON)
- [x] Supabase-schema + RLS-policies
- [x] Unit-tester (vitest)
- [x] Code-splitting per route (React.lazy)
- [x] PWA-config (vite-plugin-pwa)

### v2 (Planerat)
- [ ] Full i18n (useTranslation() i alla komponenter)
- [ ] Supabase live sync + offline-first
- [ ] Team-läge (coach kan kommentera, verifiera, pusha program)
- [ ] Sensor-integration (t.ex. shot-speed från radar)
- [ ] ML-baserad video-analys av skotteknik
- [ ] Fler språk (fi, cs, de)
- [ ] Push-notiser för streak-påminnelse och test-deadline

## Design-beslut (noterade avvikelser från prompt)

- `LogTraining.tsx` drill-picker använder kollapsbar panel i stället för modal (bättre mobil-UX)
- Mental-övningarnas "gjord"-status sparas i komponentens lokal state (session-scoped) — persistent loggning av mentala övningar är planerat till v2
- PWA-pluginen importeras med `require()` + try/catch så appen bygger utan pluginen installerad
- `vite.config.ts` kombinerar Vite + Vitest-konfiguration i en fil (officiell Vitest-rekommendation)
