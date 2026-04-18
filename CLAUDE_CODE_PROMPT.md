# Claude Code Prompt: Skillstracker → Riktigt utvecklingsverktyg för hockeyspelare

Klistra in HELA texten nedan i Claude Code (kör i projektroten `skillstracker-main/`).

---

## ROLL OCH KONTEXT

Du är en senior fullstack-utvecklare. Projektet är en svensk webbapp byggd med **React 19 + TypeScript + Vite + Tailwind + react-router-dom v7 + recharts + framer-motion**. All data sparas idag i `localStorage`. Källkoden ligger i `src/` (komponenter i `src/components/`, sidor i `src/pages/`, hjälpfunktioner i `src/lib/`, typer i `src/types.ts`).

Målet med produkten är: **få fler att faktiskt bli bättre på ishockey** — inte bara logga volym. Idag är appen en välpolerad gamifierad träningsdagbok (XP, levels, badges, FIFA-liknande 1‑99-rating, veckomål), men den lär inte ut färdigheter och belönar volym över kvalitet.

Implementera ALLA punkter nedan. Arbeta i små commits per delområde, kör `npm run lint` och `npx tsc --noEmit` efter varje större ändring, och säkerställ att `npm run build` lyckas i slutet. Lägg ALDRIG till nya beroenden utan att uppdatera `package.json`. Behåll svenska som UI-språk i v1 men förbered kodbasen för i18n (se 9).

## VIKTIGT: GÖR FÖRST (BLOCKERS)

1. **Lägg till saknad `src/pages/Dashboard.tsx`** — `App.tsx` rad 6 importerar `./pages/Dashboard` men filen finns inte, vilket bryter bygget. Skapa en Dashboard som visar: hälsning + avatar + nivå/XPBar, dagens streak (`StreakCounter`), 4 förslagna veckomål från `suggestGoals()` (`GoalCard`), senaste 3 sessionerna med snabb-länk till `LogTraining`, samt CTA "Börja dagens pass". Använd befintliga komponenter och stilklasser (`card`, `btn-primary`, `btn-ghost`, `font-display`, neon-färgerna i tailwind-config).

2. **Skapa `PLAN.md` i roten** som kort beskriver produktmål, målgrupp (U10‑adult rec + tränare), filosofi ("kvalitet > volym"), nuvarande modul-karta, och roadmap för punkterna nedan. Den ersätter den nuvarande default-Vite-README:n. Skriv om `README.md` så den faktiskt beskriver appen, hur man installerar, kör (`npm install && npm run dev`), bygger, och var man hittar PLAN.md.

## DEL 1 — DATA, TYPER, ARKITEKTUR

3. **Utöka `src/types.ts`** för att stödja allt nedan:
   - Lägg till `Position = "Forward" | "Center" | "Back" | "Goalie"`.
   - Lägg till nya sessions-fält (alla optional för bakåtkompatibilitet):
     - `tackling?: { onesWon: number; onesLost: number; gapReps: number }`
     - `offIce?: { stickhandlingMin: number; shootingPadShots: number; agilityMin: number; mobilityMin: number }`
     - `wellness?: { sleepHours: number; rpe: 1|2|3|4|5|6|7|8|9|10; soreness: 1|2|3|4|5; mood: 1|2|3|4|5 }`
     - `goalieStats?: { shotsFaced: number; saves: number }` (visas bara om position = Goalie)
     - `videoUrl?: string` och `selfReview?: { weightTransfer: boolean; stickFlex: boolean; followThrough: boolean; notes: string }`
   - Lägg till nya entiteter: `Drill`, `Program`, `ProgramWeek`, `ProgramDay`, `SkillTest`, `SkillTestResult`, `GameLog`, `TeamInvite`, `Comment`, `User` (för cloud-läge i del 8).
   - Lägg till `qualityGoal`-variant av `Goal` med `metric: "shotAccuracy" | "passCompletion" | "skillTestScore" | "programProgress"` och `threshold: number`.
   - Bumpa `AppData` med `programs: ActiveProgram[]`, `skillTests: SkillTestResult[]`, `games: GameLog[]`, `restDays: string[]`, `language: "sv" | "en"`.

4. **Migrationer i `src/lib/storage.ts`** — implementera versionerad migration (`schemaVersion`) så befintliga användare inte tappar data. Default-fyll alla nya fält säkert.

## DEL 2 — KVALITET ÖVER VOLYM (CORE FILOSOFI)

5. **Refaktor av `src/lib/stats.ts` och `src/lib/xp.ts`:**
   - Ta bort den falska `tackling`-formeln (`35 + sessions*1.2 + skatingMin*0.15`). Beräkna `tackling` från riktig data: `onesWon / (onesWon + onesLost)` + `gapReps` volym. Om position = Goalie, ersätt `tackling` i UI:t med `goaltending` baserat på `saves / shotsFaced`.
   - Cap-a teknik-sliders bidrag i XP: `techAvg * 12` → `min(techAvg * 8, 32)` så man inte kan grinda XP genom att själv-rapportera 5/5.
   - Inför **kvalitetsmultiplikator**: om `shotAccuracy >= 0.6` ge +20% bonus-XP på shot-delen; om `passCompletion >= 0.8` ge +20% bonus-XP. Belöna kvalitet, inte bara volym.
   - Lägg till `verifiedByCoach: boolean` på `Session` — verifierade sessioner ger +15% XP.

6. **Quality goals** — utöka `src/lib/goals.ts` med stöd för `metric: "shotAccuracy" | "passCompletion" | "skillTestScore" | "programProgress"`. Uppdatera `metricValue`, `metricLabel`, `goalProgressPct`, `suggestGoals` (lägg till 2 kvalitetsförslag per vecka, t.ex. "Skotts träffsäkerhet ≥ 60%" och "Passningsprocent ≥ 80%"). Uppdatera `CustomGoalForm` i `Stats.tsx` så användaren kan skapa kvalitetsmål.

## DEL 3 — DRILL-BIBLIOTEK MED COACHING-CUES

7. **Skapa `src/lib/drills.ts`** med en katalog av minst 30 drills:
   - Skating: framåt, bakåt, crossovers (vänster/höger), tight turns, mohawk, hockey-stop, edge work, stride power, transitions.
   - Skott: wrist, snap, slap, backhand, one-timer, off-foot, in stride, deflektion, screen shot.
   - Passning: forehand, backhand, saucer, sauce-back, give-and-go, no-look, board pass.
   - Pucken: stickhandling figure-8, toe drag, between-legs, dangle, protected puck.
   - Off-ice: shooting pad sets, slick board stickhandling, ladder agility, balance board, mobility.
   - Goalie: butterfly, T-push, RVH, recovery, glove/blocker drills.
   - Varje `Drill`: `id`, `name`, `category`, `position[]`, `level: "beginner"|"intermediate"|"advanced"`, `cues: string[]` (3‑5 korta tränar-tips på svenska), `videoUrl?: string` (lämna tomt eller använd YouTube-sök-länk), `progressions: { drillId: string; unlockAfter: number }[]`, `defaultDuration: number`.

8. **Drill-picker i `LogTraining.tsx`** — när användaren väljer kategori/övning, visa en panel med `cues`, video-länk och "lägg till i passet". En session ska kunna innehålla flera drills (lägg till `Session.drills?: { drillId: string; reps?: number; minutes?: number }[]`).

9. **Ny sida `src/pages/Drills.tsx` + route `/drills`** — bibliotek att bläddra i, filtrera på kategori, position, nivå. Klick öppnar detaljvy med cues, video, progression-träd.

## DEL 4 — STRUKTURERADE PROGRAM

10. **Skapa `src/lib/programs.ts`** med 4 inbyggda program:
    - **U10 Skridsko-grunder** (8 veckor, 3 pass/vecka)
    - **U14 Shooting Block** (4 veckor, 4 pass/vecka)
    - **U18 Game Pace** (6 veckor, 5 pass/vecka)
    - **Adult Rec / Beer League** (4 veckor, 2 pass/vecka)
    - Varje `Program` består av `weeks: ProgramWeek[]`, varje vecka har `days: ProgramDay[]`, varje dag har `drills: { drillId: string; sets: number; reps?: number; minutes?: number }[]` + `focusCue: string`.

11. **Ny sida `src/pages/Programs.tsx` + route `/program`** — bläddra, läs beskrivning, "Starta program". När aktivt: dagens pass visas på Dashboard, ett klick "Logga dagens pass" förfyller `LogTraining` med alla drills och rätt minuter. Visa programprogress (vecka X/Y, pass Z/W).

## DEL 5 — OBJEKTIVA SKILL-TESTER

12. **Skapa `src/lib/skillTests.ts`** med 6 tester (puck handling figur-8 på tid, 20 skott från 5 zoner / antal på mål, framåt+bakåt skating loop på tid, stop-and-start sprint, transition test, goalie-test). Varje `SkillTest`: `id`, `name`, `protocol: string[]` (steg-för-steg-instruktioner), `scoring: "time" | "count" | "percent"`, `recommendedFrequencyDays: 28`.

13. **Ny sida `src/pages/SkillTests.tsx` + route `/tester`** — välj test, läs protokoll, kör, mata in resultat → spara som `SkillTestResult { testId, date, score, notes }`. Visa progressions-graf per test över tid (recharts LineChart). Påminn när det gått 28 dagar sedan senaste testet (toast på Dashboard).

14. **Mastery-badges baserat på tester** — utöka `src/lib/badges.ts`:
    - "Sniper Pro" — 70%+ träffsäkerhet på 100 skott i `SkillTest`-zon
    - "Edge Master" — clear alla skating-tester på advanced-nivå
    - "Program Finisher" — slutför ett helt program
    - "Verified All-Star" — Overall 85+ med ≥ 50% verifierade sessioner
    Behåll volym-badgesen men markera de nya som `track: "mastery"` vs `track: "volume"`.

## DEL 6 — MATCHLOGG & GAME REFLECTION

15. **Ny sida `src/pages/Game.tsx` + route `/match`** — logga matcher separat från träning:
    - `GameLog { id, date, opponent, ourScore, theirScore, shifts, iceTimeMin, plusMinus, goals, assists, shotsOnGoal, hits, blockedShots, didWell: string, toWorkOn: string }`
    - För goalies: `saves`, `shotsAgainst`, `goalsAgainst`, `savePct` (auto).
    - Visa matcher-historik med snittstats. Match-reflektion (didWell/toWorkOn) ger +50 XP-bonus.

## DEL 7 — VILA, ÅTERHÄMTNING, MENTAL TRÄNING

16. **Wellness-sektion i `LogTraining.tsx`** (collapsible) — sömn (timmar), RPE 1‑10, ömhet 1‑5, humör 1‑5. Spara i `Session.wellness`. Visa wellness-trend i `Stats.tsx`.

17. **Vilodagar bryter inte streak** — refaktor `streakFromDates` i `src/lib/dates.ts` så `restDays: string[]` (markerade i Settings eller via knapp på Dashboard "Markera dagens vila") räknas som "ok"-luckor. Lägg till en separat `restStreak`-räknare och visa båda i `StreakCounter.tsx`. Toast: "Bra jobbat — vila är träning."

18. **Ny sida `src/pages/Mental.tsx` + route `/mental`** — innehåll med 6 övningar: 4‑7‑8 andning, visualisering av matchsituation, fokuspunkt-rutin före pass, post-game reflektionstemplate, mental-cue-kort ("hands soft, head up"), pre-shift mantra-byggare. Logga gjorda övningar (de räknas mot ett nytt "Mind Game"-badge).

## DEL 8 — TEAM, COACH & MOLN

19. **Cloud sync med Supabase** (gratis tier räcker för MVP):
    - Lägg till `@supabase/supabase-js`. Skapa `src/lib/supabase.ts` (env-vars i `.env.local`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
    - Tabellschema (skapa migration-SQL i `supabase/migrations/0001_init.sql`): `users`, `profiles`, `sessions`, `goals`, `programs_active`, `skill_test_results`, `games`, `teams`, `team_members`, `comments`.
    - RLS-policies så användare bara ser egen data + data för team de är med i.
    - Auth: magisk länk via e-post.
    - Sync-strategi: localStorage = primär källa offline, sync på app-start och efter varje mutation. Konflikthantering: server vinner per `updatedAt`.

20. **Team & coach-läge:**
    - Ny sida `src/pages/Team.tsx` + route `/team` — coach skapar team, får `joinCode`, ser lista över spelare.
    - Spelare matar in `joinCode` i Settings → går med i team.
    - Coach kan: lämna kommentar på en spelares session, verifiera teknik-rating (`Session.verifiedByCoach = true`), skapa team-utmaning ("Vi skjuter 5000 puckar i oktober"), pusha ett program till hela teamet.
    - Spelare ser kommentarer i en notis-feed på Dashboard.

## DEL 9 — i18n

21. **Internationalisering** — installera `react-i18next` + `i18next`. Bryt ut alla svenska strängar till `src/i18n/sv.json` och `src/i18n/en.json`. Använd `useTranslation()` i komponenterna. `Settings` får ett språkval. Default svenska. Förbered struktur för fler språk (fi, cs, de) men leverera bara sv+en nu.

## DEL 10 — VIDEO & SJÄLVUTVÄRDERING

22. **Video-uppladdning** — `LogTraining.tsx` får ett valfritt fält "Bifoga video" (URL till YouTube/unlisted eller `<input type="file">` som laddas till Supabase Storage om cloud är på, annars Object URL för lokal preview). Spara i `Session.videoUrl`.

23. **Strukturerad självreview-panel** — efter uppladdning visa checklista för skott: `weightTransfer` (✓), `stickFlex` (✓), `followThrough` (✓), `notes` (textarea). Spara i `Session.selfReview`. Visa i sessions-historik som chip "Self-reviewed".

## DEL 11 — POLISH & KVALITET

24. **Tester** — installera `vitest` + `@testing-library/react`. Skriv unit-tester för `xp.ts` (alla nya formler), `stats.ts` (riktiga tackling/goaltending), `goals.ts` (kvalitetsmål), `skillTests.ts`, `dates.ts` (rest-streak). Mål: 70%+ coverage på `src/lib/`.

25. **Tillgänglighet** — alla knappar har `aria-label`, formulär kopplade `<label htmlFor>`, fokusringar synliga (`focus-visible:ring-2 ring-neon-cyan`), color-contrast ≥ AA på neon-text mot mörk bakgrund (kolla "neon-cyan på ice-800" — kan behöva mörkare bakgrund vid små texter).

26. **Performance** — code-split per route med `React.lazy` + `Suspense`. Memo:a tunga `recharts`-data-aggregat. Verifiera att bundlen är < 350 KB gzipped.

27. **PWA** — installera `vite-plugin-pwa`. Manifest med ikoner (använd befintlig `public/icons.svg`), service-worker för offline-läge (cache app-shell + sista 30 dagars data). "Add to home screen" på mobil.

28. **Felhantering & tomma tillstånd** — varje sida har en snygg empty-state-vy ("Du har inte loggat något ännu — börja här"). ErrorBoundary runt routes. Toast vid sync-fel.

## DEL 12 — DOKUMENTATION

29. Uppdatera `README.md` med: vad det är, för vem, screenshots, "kom igång", arkitektur-översikt, hur man bidrar.

30. Skriv `docs/DEVELOPMENT.md` med teknik-stack, mappstruktur, hur man lägger till en ny drill, hur man lägger till ett nytt program, hur man kör tester.

31. Skapa `docs/ROADMAP.md` med vad som är klart i v1 och vad som är planerat (sensor-integration, ML-baserad video-analys, fler språk).

## ACCEPTANSKRITERIER

- [ ] `npm install && npm run dev` startar utan fel.
- [ ] `npm run build` lyckas utan TS-fel.
- [ ] `npm run lint` 0 errors.
- [ ] `npm test` (vitest) — alla tester gröna.
- [ ] Dashboard renderar korrekt (Del 0).
- [ ] Befintlig data i localStorage migreras utan dataförlust.
- [ ] Alla nya routes fungerar och är länkade i `Layout`-navigationen.
- [ ] Goalie-position kan väljas och får sin egen Overall-formel.
- [ ] Kvalitetsmål kan skapas och spåras.
- [ ] Minst 30 drills i biblioteket, alla med cues.
- [ ] Minst 4 program, alla körbara från start till slut.
- [ ] Minst 6 skill-tester med protokoll och progress-graf.
- [ ] Cloud-sync fungerar med fallback till lokalt läge om env-vars saknas.
- [ ] Team-läge: coach kan se ≥ 1 spelares data och kommentera.
- [ ] i18n: språk byts live mellan sv/en.
- [ ] PWA installerbar på mobil.
- [ ] PLAN.md, README.md, DEVELOPMENT.md, ROADMAP.md uppdaterade.

## ARBETSORDNING (FÖRESLAGEN)

1. Del 0 (blockers) → commit
2. Del 1 (typer + migration) → commit
3. Del 2 (XP/stats refaktor + tester) → commit
4. Del 3 (drills) → commit
5. Del 4 (program) → commit
6. Del 5 (skill-tester + mastery-badges) → commit
7. Del 6 (matchlogg) → commit
8. Del 7 (wellness/vila/mental) → commit
9. Del 9 (i18n) → commit (innan cloud så översättningar är klara)
10. Del 10 (video) → commit
11. Del 8 (cloud + team) → commit (sista feature, känsligast)
12. Del 11 (polish, PWA, a11y, perf) → commit
13. Del 12 (docs) → commit
14. Slut: kör full smoke test, fixa eventuella regressions, slutcommit.

Fråga endast om något är genuint tvetydigt — annars välj sunt default och dokumentera valet i en kort rad i PLAN.md. Lycka till.
