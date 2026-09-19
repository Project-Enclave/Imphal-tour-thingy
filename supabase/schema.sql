-- Run in the Supabase SQL editor. Keys remain in Vercel environment variables.
create table if not exists public.destinations (
  id text primary key, name text not null, category text not null, data jsonb not null,
  image_url text, image_credit text, visible boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'My Manipur trip', preferences jsonb not null, itinerary jsonb not null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.trip_versions (
  id uuid primary key default gen_random_uuid(), trip_id uuid not null references public.trips(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade, itinerary jsonb not null, created_at timestamptz not null default now()
);
create table if not exists public.api_events (
  id bigint generated always as identity primary key, event_type text not null, provider text,
  status text not null, latency_ms integer, metadata jsonb, created_at timestamptz not null default now()
);
alter table public.destinations enable row level security;
alter table public.trips enable row level security;
alter table public.trip_versions enable row level security;
create policy "public visible destinations" on public.destinations for select using (visible = true);
create policy "users own trips" on public.trips for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users own versions" on public.trip_versions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
