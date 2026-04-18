-- Hockey Skills Tracker — Supabase schema
-- Run via: supabase db push  (or paste in Supabase SQL editor)

-- ============================================================
-- Users / Profiles
-- ============================================================
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null default 'Ny Spelare',
  position text not null default 'Forward',
  emoji text not null default '🏒',
  jersey_number integer not null default 99,
  photo_url text,
  language text not null default 'sv',
  xp integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Sessions
-- ============================================================
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  shots_attempts integer not null default 0,
  shots_on_target integer not null default 0,
  passes_attempts integer not null default 0,
  passes_completed integer not null default 0,
  skating_drill text not null default 'framat',
  skating_minutes integer not null default 0,
  tech_stickhandling integer not null default 3,
  tech_dekar integer not null default 3,
  tech_balance integer not null default 3,
  note text,
  verified_by_coach boolean not null default false,
  goalie_shots_faced integer,
  goalie_saves integer,
  video_url text,
  self_review jsonb,
  wellness jsonb,
  drills jsonb,
  tackling_data jsonb,
  off_ice jsonb
);

-- ============================================================
-- Goals
-- ============================================================
create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  metric text not null,
  target numeric not null,
  week_start date not null,
  suggested boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Games
-- ============================================================
create table if not exists games (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  date date not null,
  opponent text not null,
  our_score integer not null default 0,
  their_score integer not null default 0,
  shifts integer,
  ice_time_min integer,
  plus_minus integer,
  goals integer,
  assists integer,
  shots_on_goal integer,
  hits integer,
  blocked_shots integer,
  did_well text,
  to_work_on text,
  saves integer,
  shots_against integer,
  goals_against integer,
  save_pct numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Skill test results
-- ============================================================
create table if not exists skill_test_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  test_id text not null,
  date date not null,
  score numeric not null,
  notes text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Active programs
-- ============================================================
create table if not exists programs_active (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  program_id text not null,
  started_at date not null,
  current_week integer not null default 0,
  current_day integer not null default 0,
  completed_days jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Teams
-- ============================================================
create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  join_code text unique not null,
  coach_id uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists team_members (
  team_id uuid references teams(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  role text not null default 'player', -- 'coach' | 'player'
  joined_at timestamptz not null default now(),
  primary key (team_id, user_id)
);

-- ============================================================
-- Coach comments on sessions
-- ============================================================
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade not null,
  author_id uuid references profiles(id) on delete cascade not null,
  author_name text not null,
  text text not null,
  is_coach boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table profiles enable row level security;
alter table sessions enable row level security;
alter table goals enable row level security;
alter table games enable row level security;
alter table skill_test_results enable row level security;
alter table programs_active enable row level security;
alter table teams enable row level security;
alter table team_members enable row level security;
alter table comments enable row level security;

-- Users own their own data
create policy "Own profile" on profiles for all using (auth.uid() = id);
create policy "Own sessions" on sessions for all using (auth.uid() = user_id);
create policy "Own goals" on goals for all using (auth.uid() = user_id);
create policy "Own games" on games for all using (auth.uid() = user_id);
create policy "Own skill tests" on skill_test_results for all using (auth.uid() = user_id);
create policy "Own programs" on programs_active for all using (auth.uid() = user_id);

-- Team members can see team data
create policy "Team members" on sessions for select using (
  user_id in (
    select tm.user_id from team_members tm
    where tm.team_id in (
      select team_id from team_members where user_id = auth.uid()
    )
  )
);

create policy "Own teams" on teams for all using (auth.uid() = coach_id);
create policy "Team membership" on team_members for select using (
  team_id in (select team_id from team_members where user_id = auth.uid())
);

create policy "Coach comments" on comments for select using (
  session_id in (select id from sessions where user_id = auth.uid())
);
create policy "Write comments" on comments for insert with check (auth.uid() = author_id);
