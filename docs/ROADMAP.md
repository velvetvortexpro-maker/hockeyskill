# Roadmap

## v1 — Klart

### Kärna
- [x] Dashboard: XP-bar, streak, veckomål, senaste sessioner, badges
- [x] Träningslogg: skott, passningar, skridsko, teknik, noter
- [x] FIFA-liknande spelarkort med 1-99-ratings
- [x] XP + 6 nivåer (Rookie → Legend)
- [x] localStorage med schema-migration (v1→v2, bakåtkompatibel)

### Kvalitet över volym (filosofi)
- [x] Tech-slider capped (max 32 XP — inte grindbart)
- [x] +20% XP-bonus för shot accuracy ≥ 60%
- [x] +20% XP-bonus för pass completion ≥ 80%
- [x] +15% XP för coach-verifierade sessioner
- [x] Tackling från riktiga 1v1-data (onesWon/onesLost + gapReps)
- [x] Goalie-position: rating baseras på räddningsprocent
- [x] Kvalitetsmål (shotAccuracy, passCompletion) i mål-systemet

### Drill-bibliotek
- [x] 41 drills med coaching-cues (3-5 per drill)
- [x] Kategorier: skating, shooting, passing, puck, off-ice, goalie
- [x] Nivåer: beginner/intermediate/advanced
- [x] Positions-filter (Forward/Center/Back/Goalie)
- [x] Progressions-träd
- [x] Drill-picker i träningsloggen

### Strukturerade program
- [x] U10 Skridsko-grunder (8 veckor, 3 pass/vecka)
- [x] U14 Shooting Block (4 veckor, 4 pass/vecka)
- [x] U18 Game Pace (6 veckor, 5 pass/vecka)
- [x] Adult Rec / Beer League (4 veckor, 2 pass/vecka)
- [x] Dagligt pass med drills och focus-cue
- [x] Programprogress-visning

### Färdighetstester
- [x] 6 objektiva tester med steg-för-steg-protokoll
- [x] Poängsättning: tid, antal, procent
- [x] Progressionsgraf per test (recharts LineChart)
- [x] Påminnelse var 28:e dag
- [x] Mastery-badges baserade på testresultat

### Matchlogg
- [x] Logga matcher: mål, assist, istid, +/-, skott på mål
- [x] Goalie-läge: räddningar, skott mot, SV%
- [x] Match-reflektion (didWell/toWorkOn) → +50 XP
- [x] Matchhistorik med vinst/förlust-visuell

### Wellness & mental
- [x] Wellness-sektion i loggen: sömn, RPE, ömhet, humör
- [x] Vilodagar: bryter inte streak (toggel i Inställningar + Dashboard)
- [x] Mental träning: 6 övningar (andning, visualisering, mantra, etc.)

### Badges
- [x] 10 volym-badges (First Shift → Gretzky Mode)
- [x] 5 mastery-badges (Sniper Pro, Edge Master, Program Finisher, Verified All-Star, Mind Game)
- [x] Track-etikett: volume / mastery

### Platform
- [x] Code-splitting per route (React.lazy + Suspense)
- [x] i18n-struktur med sv.json + en.json (react-i18next)
- [x] Supabase-schema + RLS-policies (SQL-migration)
- [x] supabase.ts med lazy-load (fallback till localStorage)
- [x] Unit-tester: xp.ts, stats.ts, goals.ts, dates.ts
- [x] vite.config.ts med PWA-config + vitest-setup
- [x] Aria-labels på knappar och formulär

## v2 — Planerat

### Full i18n
- [ ] `useTranslation()` i alla komponenter
- [ ] Språkbyte live (sv ↔ en)
- [ ] Finska, tjeckiska, tyska översättningar

### Cloud sync + offline-first
- [ ] Fullständig Supabase-sync vid app-start
- [ ] Konflikhantering: server vinner per `updatedAt`
- [ ] Magic-link auth (e-post)
- [ ] Offline-queue för mutationer

### Team & coach
- [ ] Coach skapar team och får join-code
- [ ] Spelare går med via join-code i Inställningar
- [ ] Coach kan kommentera på sessioner
- [ ] Coach kan verifiera teknik-rating (`verifiedByCoach = true`)
- [ ] Coach kan pusha program till hela teamet
- [ ] Team-utmaningar (t.ex. "Vi skjuter 5000 puckar i oktober")
- [ ] Notis-feed för spelarkommentarer

### Video & AI
- [ ] Videouppladdning till Supabase Storage
- [ ] ML-baserad analys av skotteknik (pose estimation)
- [ ] Automatisk checklista baserad på video

### PWA & push
- [ ] Push-notiser för streak-påminnelse
- [ ] Påminnelse 28 dagar efter senaste skill-test
- [ ] "Add to home screen"-prompt

### Sensor-integration
- [ ] Shot-speed från radar/sensor (BLE)
- [ ] HRV och hjärtfrekvens från smartwatch

### Övrigt
- [ ] Team-leaderboard
- [ ] Periodiserings-kalender (planera kommande veckor)
- [ ] Export av data (CSV, PDF-rapport)
- [ ] Coachens dashboard med spelarlista
