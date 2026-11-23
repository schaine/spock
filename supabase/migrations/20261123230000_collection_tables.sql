-- Tables of the daily data collection (spec #15, ticket #16).
-- Visitors (no account) may read everything here except technical errors;
-- only the collection, which uses the secret key, may write (ADR 0002).

create table public.regions (
  code text primary key,
  name text not null
);

create table public.publishers (
  code text primary key,
  name text not null
);

create table public.indicators (
  number integer primary key,
  name text not null,
  core_family text not null,
  timing text not null check (timing in ('leading', 'lagging'))
);

create table public.series (
  id bigint generated always as identity primary key,
  indicator_number integer not null references public.indicators (number),
  -- Null for Series not tied to a Region (hyperscalers, AI model companies).
  region_code text references public.regions (code),
  publisher_code text not null references public.publishers (code),
  -- The Publisher's own label, such as UNRATE at FRED.
  publisher_series_code text not null,
  -- Extra request options a collector needs (filters, units...).
  publisher_options jsonb not null default '{}'::jsonb,
  frequency text not null check (frequency in ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
  unit text not null,
  seasonally_adjusted boolean not null,
  wave integer not null check (wave in (1, 2, 3)),
  status text not null default 'coming_soon' check (status in ('coming_soon', 'active')),
  unique (publisher_code, publisher_series_code, publisher_options)
);

-- One value per Series and period: the Publisher's latest value only (ADR 0005).
create table public.series_values (
  series_id bigint not null references public.series (id),
  -- First day of the period the value describes (a month, a quarter, a day...).
  period date not null,
  value numeric not null,
  -- True for the values that arrived at the Series' latest successful check.
  is_new boolean not null default true,
  stored_at timestamptz not null default now(),
  primary key (series_id, period)
);

-- When each Series was last checked, and how that went.
create table public.series_checks (
  series_id bigint primary key references public.series (id),
  last_checked_at timestamptz,
  last_success_at timestamptz,
  consecutive_failures integer not null default 0,
  -- Technical detail for the Owner and the agent; never shown to Visitors.
  last_error text
);

create table public.update_log (
  id bigint generated always as identity primary key,
  logged_at timestamptz not null default now(),
  kind text not null check (kind in ('new_value', 'revision', 'missed_check', 'series_change')),
  series_id bigint not null references public.series (id),
  sentence text not null,
  details jsonb not null default '{}'::jsonb
);

create index update_log_logged_at on public.update_log (logged_at desc);
create index update_log_series on public.update_log (series_id);

-- Read-only for Visitors: row level security on, a read policy, no write policy.
alter table public.regions enable row level security;
alter table public.publishers enable row level security;
alter table public.indicators enable row level security;
alter table public.series enable row level security;
alter table public.series_values enable row level security;
alter table public.series_checks enable row level security;
alter table public.update_log enable row level security;

create policy "Anyone can read" on public.regions for select using (true);
create policy "Anyone can read" on public.publishers for select using (true);
create policy "Anyone can read" on public.indicators for select using (true);
create policy "Anyone can read" on public.series for select using (true);
create policy "Anyone can read" on public.series_values for select using (true);
create policy "Anyone can read" on public.series_checks for select using (true);
create policy "Anyone can read" on public.update_log for select using (true);

-- Belt and braces: take write rights away from the public roles too.
revoke insert, update, delete, truncate on
  public.regions, public.publishers, public.indicators, public.series,
  public.series_values, public.series_checks, public.update_log
from anon, authenticated;

-- Visitors see check status, but not the technical error text.
revoke select on public.series_checks from anon, authenticated;
grant select (series_id, last_checked_at, last_success_at, consecutive_failures)
  on public.series_checks to anon, authenticated;

-- Stores a Series' values from one successful check, in one transaction:
-- clears the previous "new" marks, adds the periods not stored yet, marks
-- them new, and returns them as one JSON list, oldest first (one value, so
-- the API's 1,000-row limit does not cut it). Values already stored are
-- left as they are (Revisions come with ticket #17).
create function public.store_new_values(p_series_id bigint, p_values jsonb)
returns jsonb
language sql
set search_path = ''
as $$
  -- Postgres always runs a data-changing WITH part, even when unread.
  with cleared as (
    update public.series_values v
    set is_new = false
    where v.series_id = p_series_id and v.is_new
  ),
  added as (
    insert into public.series_values as v (series_id, period, value, is_new)
    select p_series_id, (o ->> 'period')::date, (o ->> 'value')::numeric, true
    from jsonb_array_elements(p_values) o
    on conflict (series_id, period) do nothing
    returning v.period, v.value
  )
  select coalesce(
    jsonb_agg(jsonb_build_object('period', period, 'value', value) order by period),
    '[]'::jsonb
  )
  from added;
$$;

revoke execute on function public.store_new_values(bigint, jsonb) from public, anon, authenticated;
grant execute on function public.store_new_values(bigint, jsonb) to service_role;
