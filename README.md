# Hockey Skills Tracker

En webbapp för hockeyspelare som vill bli bättre — inte bara logga mer. Kombinerar gamifiering (XP, levels, badges) med strukturerade drill-cues, objektiva tester, träningsprogram och matchlogg.

## För vem?

- Spelare **U10 till vuxen** (rekreation och seriös)
- **Tränare** som vill följa spelares framsteg och ge feedback
- **Föräldrar** som hjälper yngre spelare att logga träning

## Filosofi

> Kvalitet över volym. Träna rätt, inte bara mycket.

Appen belönar träffsäkerhet och passningskvalitet mer än råvolym. Tackling beräknas från riktiga 1v1-data. Goalie får sin egen rating baserad på räddningsprocent.

## Funktioner

| Funktion | Beskrivning |
|----------|-------------|
| Träningslogg | Logga skott, passningar, skridsko, teknik, drills, wellness och video |
| Stats | FIFA-liknande 1-99-rating, veckotrend och månadskomparison |
| Badges | 15 badges — volym- och mastery-spår |
| Drill-bibliotek | 41 drills med coaching-cues, nivåer och progressioner |
| Program | 4 strukturerade program (U10/U14/U18/Vuxen) |
| Tester | 6 objektiva färdighetstester med progressionsgraf |
| Matchlogg | Logga matcher, stats och reflektion (+50 XP för reflektion) |
| Mental | 6 mentala träningsövningar |
| Vilodagar | Markera vila — bryter inte streaken |
| Goalie-läge | Separat formel baserad på räddningsprocent |

## Kom igång

### Krav

- Node.js 18+
- npm 9+

### Installation

```bash
git clone <repo-url>
cd skillstracker-main
npm install
npm run dev
```

Öppna http://localhost:5173

### Bygg för produktion

```bash
npm run build
npm run preview
```

### Kör tester

```bash
npm test
```

### Lint

```bash
npm run lint
```

## Miljövariabler (valfritt — cloud sync)

Skapa `.env.local` i projektroten:

```env
VITE_SUPABASE_URL=https://ditt-projekt.supabase.co
VITE_SUPABASE_ANON_KEY=din-anon-nyckel
```

Utan dessa kör appen helt offline med localStorage.

## Arkitektur

Se PLAN.md för fullständig modul-karta och design-beslut.

## Teknisk stack

- React 19 + TypeScript
- Vite 8 + vite-plugin-pwa (PWA)
- Tailwind CSS 3 med custom ice/neon-tema
- react-router-dom v7 (kod-splittning per route)
- recharts för grafer
- framer-motion för animationer
- i18next + react-i18next (sv/en)
- Supabase (valfri cloud sync)
- vitest + @testing-library/react

## Bidra

1. Skapa en branch: `git checkout -b feature/min-feature`
2. Gör ändringar och kör `npm run lint && npx tsc --noEmit`
3. Skapa en PR med beskrivning av vad och varför

Se docs/DEVELOPMENT.md för detaljer.
