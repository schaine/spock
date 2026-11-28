-- Revisions (ticket #17, ADR 0005): when a Publisher changes a value it
-- published earlier, the corrected value replaces the stored one and the
-- Update log keeps the old and the new value. When a Publisher stops giving
-- a value it published earlier, Spock keeps the last one and the Update log
-- says so, once (decided by the Owner on 2026-11-28).
--
-- Same as the first version (20261123230000_collection_tables.sql), plus the
-- Revision and the "no longer given" steps at the end of the stored values part.

-- When the Publisher stopped giving this value; null while it still gives it.
-- Lets the Update log say so once, not every night.
alter table public.series_values add column withdrawn_at timestamptz;

create or replace function public.record_successful_check(p_series_id bigint, p_values jsonb, p_checked_at timestamptz)
returns void
language plpgsql
set search_path = ''
as $$
declare
  v_first_load boolean;
  v_series record;
begin
  v_first_load := not exists (select 1 from public.series_values where series_id = p_series_id);

  select s.frequency, s.unit, p.name as publisher,
    concat_ws(', ', i.name, r.name) as label -- "Unemployment rate, United States"
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
        v_series.label,
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

  -- Runs after the new values are stored, so they compare equal and only
  -- periods stored before tonight can count as Revisions.
  with incoming as (
    select (o ->> 'period')::date as period, (o ->> 'value')::numeric as value
    from jsonb_array_elements(p_values) o
  ),
  changes as (
    select i.period, v.value as old_value, i.value as new_value,
      jsonb_build_object('period', i.period, 'old_value', v.value, 'new_value', i.value) as change
    from incoming i
    join public.series_values v on v.series_id = p_series_id and v.period = i.period
    where v.value <> i.value
  ),
  replaced as (
    update public.series_values v
    set value = c.new_value, stored_at = p_checked_at
    from changes c
    where v.series_id = p_series_id and v.period = c.period
  ),
  -- Ties go to the earliest period, so the same answer always names the same month.
  largest as (
    select * from changes order by abs(new_value - old_value) desc, period limit 1
  ),
  summary as (
    select count(*) as count, min(period) as first, max(period) as last,
      jsonb_agg(change order by period) as changes
    from changes
  )
  -- One Revision gets its own line; several in one run share one grouped
  -- line, so a yearly re-estimate does not flood the Update log, and its
  -- details keep every change.
  insert into public.update_log (logged_at, kind, series_id, sentence, details)
  select p_checked_at, 'revision', p_series_id,
    case when s.count = 1 then
      format('Revision from %s: %s, %s: %s → %s',
        v_series.publisher,
        v_series.label,
        public.format_period(l.period, v_series.frequency),
        public.format_value(l.old_value, v_series.unit),
        public.format_value(l.new_value, v_series.unit))
    else
      format('%s Revisions from %s: %s, %s to %s; largest change: %s, %s → %s',
        s.count,
        v_series.publisher,
        v_series.label,
        public.format_period(s.first, v_series.frequency),
        public.format_period(s.last, v_series.frequency),
        public.format_period(l.period, v_series.frequency),
        public.format_value(l.old_value, v_series.unit),
        public.format_value(l.new_value, v_series.unit))
    end,
    case when s.count = 1 then
      l.change
    else
      jsonb_build_object('count', s.count, 'largest', l.change, 'changes', s.changes)
    end
  from summary s
  cross join largest l;

  -- A value given again is no longer withdrawn; if it changed, the Revision
  -- step above has already logged it.
  update public.series_values v
  set withdrawn_at = null
  where v.series_id = p_series_id and v.withdrawn_at is not null
    and exists (select 1 from jsonb_array_elements(p_values) o where (o ->> 'period')::date = v.period);

  with withdrawn as (
    update public.series_values v
    set withdrawn_at = p_checked_at
    where v.series_id = p_series_id and v.withdrawn_at is null
      and not exists (select 1 from jsonb_array_elements(p_values) o where (o ->> 'period')::date = v.period)
    returning v.period, v.value
  ),
  summary as (
    select count(*) as count, min(period) as first, max(period) as last, min(value) as value,
      jsonb_agg(jsonb_build_object('period', period, 'old_value', value, 'new_value', null)
        order by period) as changes
    from withdrawn
  )
  insert into public.update_log (logged_at, kind, series_id, sentence, details)
  select p_checked_at, 'revision', p_series_id,
    case when count = 1 then
      format('%s no longer gives a value for %s, %s; Spock keeps the last one it gave: %s',
        v_series.publisher, v_series.label,
        public.format_period(first, v_series.frequency),
        public.format_value(value, v_series.unit))
    else
      format('%s no longer gives %s values of %s, %s to %s; Spock keeps the last ones it gave',
        v_series.publisher, count, v_series.label,
        public.format_period(first, v_series.frequency),
        public.format_period(last, v_series.frequency))
    end,
    case when count = 1 then changes -> 0
    else jsonb_build_object('count', count, 'changes', changes)
    end
  from summary
  where count > 0;

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
