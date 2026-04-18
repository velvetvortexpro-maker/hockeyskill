# Development Guide

## Teknisk stack

| Teknologi | Version | Syfte |
|-----------|---------|-------|
| React | 19 | UI-framework |
| TypeScript | ~6.0 | Typsäkerhet |
| Vite | 8 | Bundler + dev-server |
| Tailwind CSS | 3.4 | Styling |
| react-router-dom | 7 | Routing med kod-splittning |
| recharts | 3 | Grafer (LineChart, BarChart) |
| framer-motion | 12 | Animationer |
| i18next + react-i18next | latest | Internationalisering |
| Supabase | 2.x | Cloud sync (valfritt) |
| vitest | 2.x | Unit-tester |
| vite-plugin-pwa | 0.21 | PWA + service worker |

## Mappstruktur

```
src/
  components/        Delade React-komponenter
    AppContext.tsx    Global state context
    Layout.tsx        App-skal + navigation
    PlayerCard.tsx    FIFA-liknande spelarkort
    XPBar.tsx         Level-progress-bar
    StreakCounter.tsx  Streak-visning
    GoalCard.tsx       Veckomål-kort
    BadgeTile.tsx      Badge-komponent
    Toast.tsx          Notification stack
    Confetti.tsx       Konfetti-animation

  lib/               Ren business-logik (ingen React)
    badges.ts         Badge-definitioner + evaluering
    dates.ts          Datumhjälpfunktioner + streak
    drills.ts         Drill-katalog (41 drills)
    goals.ts          Volym- och kvalitetsmål
    programs.ts       Träningsprogram (4 st)
    skillTests.ts     Färdighetstester (6 st)
    stats.ts          1-99 rating-beräkning
    storage.ts        localStorage + migration
    supabase.ts       Cloud sync (lazy-load)
    useAppData.ts     Huvud-state-hook
    xp.ts             XP + level-formler
    __tests__/        Unit-tester

  i18n/
    sv.json           Svenska strängar
    en.json           Engelska strängar
    i18n.ts           i18n-initiering

  pages/             En sida per route
    Dashboard.tsx
    LogTraining.tsx
    Stats.tsx
    Badges.tsx
    Settings.tsx
    Drills.tsx
    Programs.tsx
    SkillTests.tsx
    Game.tsx
    Mental.tsx

  types.ts           Alla TypeScript-typer
  App.tsx            Router + routes (med lazy-loading)
  main.tsx           Entry point
  index.css          Tailwind + custom klasser

supabase/
  migrations/
    0001_init.sql    Databasschema + RLS-policies

docs/
  DEVELOPMENT.md     Den här filen
  ROADMAP.md         Vad som är klart och vad som planeras

PLAN.md              Produktmål, filosofi, arkitektur
README.md            Användardokumentation
```

## Köra lokalt

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # produktion → dist/
npm run preview   # förhandsvisa dist/
npm run lint      # ESLint
npm test          # vitest (en gång)
npm run test:watch # vitest (watch-läge)
npx tsc --noEmit  # TypeScript-typcheck utan att bygga
```

## Lägga till en ny drill

1. Öppna `src/lib/drills.ts`
2. Lägg till ett objekt i `DRILLS`-arrayen:

```typescript
{
  id: "mitt_drill_id",           // unikt snake_case-id
  name: "Drillens namn",
  category: "skating",           // skating | shooting | passing | puck | offIce | goalie
  position: ["Forward", "Center"],  // vilka positioner drillet passar
  level: "intermediate",         // beginner | intermediate | advanced
  cues: [
    "Cue 1 — max en mening",
    "Cue 2",
    "Cue 3",
  ],
  progressions: [{ drillId: "nästa_drill_id", unlockAfter: 10 }],
  defaultDuration: 15,           // minuter
},
```

3. Drillet dyker automatiskt upp i `/drills` och drill-picker i `LogTraining`.

## Lägga till ett nytt program

1. Öppna `src/lib/programs.ts`
2. Lägg till ett objekt i `PROGRAMS`-arrayen:

```typescript
{
  id: "mitt_program",
  name: "Programmets namn",
  description: "Kort beskrivning.",
  targetAudience: "Vem det riktar sig till",
  weeks: [
    {
      days: [
        {
          drills: [
            { drillId: "skating_forward", sets: 3, minutes: 10 },
          ],
          focusCue: "Cue för dagen",
        },
        // fler dagar...
      ],
    },
    // fler veckor...
  ],
},
```

3. Programmet visas automatiskt på `/program`.

## Lägga till ett nytt färdighetstest

1. Öppna `src/lib/skillTests.ts`
2. Lägg till ett objekt i `SKILL_TESTS`-arrayen:

```typescript
{
  id: "mitt_test",
  name: "Testets namn",
  protocol: [
    "Steg 1...",
    "Steg 2...",
  ],
  scoring: "time",  // time | count | percent
  recommendedFrequencyDays: 28,
},
```

## Lägga till en ny badge

1. Öppna `src/lib/badges.ts`
2. Lägg till ett objekt i `BADGES`-arrayen:

```typescript
{
  id: "mitt_badge",
  name: "Badge-namn",
  description: "Vad krävs?",
  emoji: "🏒",
  rarity: "gold",    // bronze | silver | gold | legend
  track: "mastery",  // volume | mastery
  check: (data) => /* villkor */ true,
},
```

## Köra tester

```bash
npm test                        # kör alla tester en gång
npm run test:watch              # kör i watch-läge
npx vitest run --coverage       # med coverage-rapport
```

Tester ligger i `src/lib/__tests__/`. Täckningsgrad-mål: 70%+ för `src/lib/`.

## Supabase (cloud sync)

1. Skapa ett projekt på [supabase.com](https://supabase.com)
2. Kör `supabase/migrations/0001_init.sql` i SQL-editorn
3. Lägg till i `.env.local`:
   ```
   VITE_SUPABASE_URL=https://xxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
4. Appen synkar automatiskt när env-vars finns

## i18n

Alla strängar finns i `src/i18n/sv.json` och `src/i18n/en.json`.

För att aktivera `useTranslation()` i en komponent:
1. Se till att `initI18n()` körs i `main.tsx`
2. Importera: `import { useTranslation } from 'react-i18next'`
3. Använd: `const { t } = useTranslation(); t('nav.dashboard')`

## Tailwind-klasser

Anpassade klasser definierade i `src/index.css`:
- `.card` — kortbakgrund med border och rounded-xl
- `.btn-primary` — fylld cyan-knapp
- `.btn-ghost` — genomskinlig knapp
- `.input` — textfältsstil
- `.label` — formulär-label
- `.stat-chip` — liten statistik-chip

## TypeScript

Alla typer ligger i `src/types.ts`. Kör typcheck:
```bash
npx tsc --noEmit
```
