-- Supabase schema for AI Powered Recipe MVP
-- Run in the SQL editor or via supabase CLI

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- profiles (1-1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  diet_preferences jsonb,        -- likes, cuisines, notes
  allergies text[],              -- ["peanut","gluten"]
  deficiencies text[],           -- ["iron","b12"]
  activity_level text,           -- ["low","medium","high"]
  age int,
  gender text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_profiles_updated_at on public.profiles (updated_at desc);

-- recipes (store generated result for history/favorites)
create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  title text not null,
  overview text,
  ingredients jsonb not null,    -- [{name, quantity, unit}]
  steps text[] not null,         -- 5-8 steps
  nutrition jsonb,               -- {calories, protein, carbs, fat}
  meal_type text,                -- "breakfast"|"lunch"|"dinner"|"snack"
  source text default 'ai',
  created_at timestamptz default now()
);

create index if not exists idx_recipes_user_id_created on public.recipes (user_id, created_at desc);

-- favorites (join)
create table if not exists public.favorites (
  user_id uuid references auth.users(id) on delete cascade,
  recipe_id uuid references public.recipes(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, recipe_id)
);

-- feedback
create table if not exists public.recipe_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  recipe_id uuid references public.recipes(id) on delete cascade,
  rating smallint check (rating in (1,2)), -- 1=down, 2=up
  comment text,
  created_at timestamptz default now()
);

create index if not exists idx_feedback_recipe on public.recipe_feedback (recipe_id);

-- analytics events (simple, append-only)
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  event_type text not null,      -- "recipe_generated", "recipe_saved", etc.
  metadata jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_events_user_type_created on public.events (user_id, event_type, created_at desc);

-- Triggers to keep updated_at current
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- Enable RLS (policies are defined in policies.sql)
alter table public.profiles enable row level security;
alter table public.recipes enable row level security;
alter table public.favorites enable row level security;
alter table public.recipe_feedback enable row level security;
alter table public.events enable row level security;


