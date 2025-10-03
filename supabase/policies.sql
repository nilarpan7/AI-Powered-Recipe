-- Row Level Security policies for AI Powered Recipe MVP

-- Ensure RLS is enabled (also set in schema.sql)
alter table public.profiles enable row level security;
alter table public.recipes enable row level security;
alter table public.favorites enable row level security;
alter table public.recipe_feedback enable row level security;
alter table public.events enable row level security;

-- Helper policies

-- PROFILES: each user can manage their own profile
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
for select using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id);

-- RECIPES: users can insert their own recipes, read their own; optionally allow read-any for public feed (disabled here)
drop policy if exists "recipes_select_own" on public.recipes;
create policy "recipes_select_own" on public.recipes
for select using (user_id is null or auth.uid() = user_id);

drop policy if exists "recipes_insert_own" on public.recipes;
create policy "recipes_insert_own" on public.recipes
for insert with check (user_id is null or auth.uid() = user_id);

-- Allow owners to delete their own recipes
drop policy if exists "recipes_delete_own" on public.recipes;
create policy "recipes_delete_own" on public.recipes
for delete using (auth.uid() = user_id);

-- FAVORITES: users can manage their own favorites
drop policy if exists "favorites_select_own" on public.favorites;
create policy "favorites_select_own" on public.favorites
for select using (auth.uid() = user_id);

drop policy if exists "favorites_insert_own" on public.favorites;
create policy "favorites_insert_own" on public.favorites
for insert with check (auth.uid() = user_id);

drop policy if exists "favorites_delete_own" on public.favorites;
create policy "favorites_delete_own" on public.favorites
for delete using (auth.uid() = user_id);

-- RECIPE FEEDBACK: users can view their own feedback, and insert feedback linked to themselves
drop policy if exists "feedback_select_own" on public.recipe_feedback;
create policy "feedback_select_own" on public.recipe_feedback
for select using (auth.uid() = user_id);

drop policy if exists "feedback_insert_own" on public.recipe_feedback;
create policy "feedback_insert_own" on public.recipe_feedback
for insert with check (auth.uid() = user_id);

-- EVENTS: anyone authenticated can insert their own events; reading events is restricted (service role only)
drop policy if exists "events_insert_own" on public.events;
create policy "events_insert_own" on public.events
for insert with check (user_id is null or auth.uid() = user_id);

-- Do NOT add a SELECT policy for events to keep them private (or add a restrictive one later)


