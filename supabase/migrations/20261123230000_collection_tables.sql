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
  -- Nights in a row whose checks all failed (a failed 05:30 retry does not
  -- add a second one for the same night).
  consecutive_failed_nights integer not null default 0,
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
grant select (series_id, last_checked_at, last_success_at, consecutive_failed_nights)
  on public.series_checks to anon, authenticated;

-- How periods and values read in Update log sentences.
create function public.format_period(p_period date, p_frequency text)
returns text
language sql
immutable
set search_path = ''
as $$
  select case p_frequency
    when 'monthly' then to_char(p_period, 'FMMonth YYYY')
    else to_char(p_period, 'YYYY-MM-DD') -- other frequencies come with their Series
  end;
$$;

create function public.format_value(p_value numeric, p_unit text)
returns text
language sql
immutable
set search_path = ''
as $$
  select case p_unit when 'percent' then p_value::text || '%' else p_value::text || ' ' || p_unit end;
$$;

-- Records a successful check of a Series, in one transaction so that values
-- and their Update log lines are never separated: clears the previous "new"
-- marks, adds the periods not stored yet and marks them new, writes the
-- Update log (one "History loaded" line for the first load, then one line
-- per new value), and updates the check status. Values already stored are
-- left as they are (Revisions come with ticket #17).
create function public.record_successful_check(p_series_id bigint, p_values jsonb, p_checked_at timestamptz)
returns void
language plpgsql
set search_path = ''
as $$
declare
  v_first_load boolean;
  v_series record;
begin
  v_first_load := not exists (select 1 from public.series_values where series_id = p_series_id);

  select s.frequency, s.unit, i.name as indicator, r.name as region, p.name as publisher
  into strict v_series
  from public.series s
  join public.indicators i on i.number = s.indicator_number
  left join public.regions r on r.code = s.region_code
  join public.publishers p on p.code = s.publisher_code
  where s.id = p_series_id;

  update public.series_values set is_new = false where series_id = p_series_id and is_new;

  with added as (
    insert into public.series_values as v (series_id, period, value, is_new)
    select p_series_id, (o ->> 'period')::date, (o ->> 'value')::numeric, true
    from jsonb_array_elements(p_values) o
    on conflict (series_id, period) do nothing
    returning v.period, v.value
  ),
  history_line as (
    select format('History loaded: %s to %s',
        public.format_period(min(period), v_series.frequency),
        public.format_period(max(period), v_series.frequency)) as sentence,
      jsonb_build_object('first', min(period), 'last', max(period), 'count', count(*)) as details,
      min(period) as period
    from added
    where v_first_load
    having count(*) > 0
  ),
  new_value_lines as (
    select format('New value from %s: %s, %s: %s',
        v_series.publisher,
        concat_ws(', ', v_series.indicator, v_series.region),
        public.format_period(period, v_series.frequency),
        public.format_value(value, v_series.unit)) as sentence,
      jsonb_build_object('period', period, 'value', value) as details,
      period
    from added
    where not v_first_load
  )
  insert into public.update_log (logged_at, kind, series_id, sentence, details)
  select p_checked_at, 'new_value', p_series_id, sentence, details
  from (select * from history_line union all select * from new_value_lines) lines
  order by period;

  insert into public.series_checks as c
    (series_id, last_checked_at, last_success_at, consecutive_failed_nights, last_error)
  values (p_series_id, p_checked_at, p_checked_at, 0, null)
  on conflict (series_id) do update set
    last_checked_at = excluded.last_checked_at,
    last_success_at = excluded.last_success_at,
    consecutive_failed_nights = 0,
    last_error = null;
end;
$$;

-- Records a failed check. A night counts once: a failure within 12 hours of
-- an earlier failure (the 05:30 retry after the 23:30 run) adds no night.
create function public.record_failed_check(p_series_id bigint, p_error text, p_checked_at timestamptz)
returns void
language sql
set search_path = ''
as $$
  insert into public.series_checks as c (series_id, last_checked_at, consecutive_failed_nights, last_error)
  values (p_series_id, p_checked_at, 1, p_error)
  on conflict (series_id) do update set
    consecutive_failed_nights = c.consecutive_failed_nights + case
      when c.last_checked_at > p_checked_at - interval '12 hours'
        and c.last_checked_at is distinct from c.last_success_at then 0
      else 1
    end,
    last_checked_at = p_checked_at,
    last_error = p_error;
$$;

revoke execute on function public.record_successful_check(bigint, jsonb, timestamptz) from public, anon, authenticated;
revoke execute on function public.record_failed_check(bigint, text, timestamptz) from public, anon, authenticated;
grant execute on function public.record_successful_check(bigint, jsonb, timestamptz) to service_role;
grant execute on function public.record_failed_check(bigint, text, timestamptz) to service_role;
