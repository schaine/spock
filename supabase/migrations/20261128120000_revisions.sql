-- Revisions (ticket #17, ADR 0005): when a Publisher changes a value it
-- published earlier, the corrected value replaces the stored one and the
-- Update log keeps the old and the new value.
--
-- Same as the first version (20261123230000_collection_tables.sql), plus the
-- Revision step at the end of the stored values part.
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

  -- Runs after the new values are stored, so they compare equal and only
  -- periods stored before tonight can count as Revisions.
  with incoming as (
    select (o ->> 'period')::date as period, (o ->> 'value')::numeric as value
    from jsonb_array_elements(p_values) o
  ),
  changes as (
    select i.period, v.value as old_value, i.value as new_value
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
  -- Ties go to the earliest period.
  largest as (
    select * from changes order by abs(new_value - old_value) desc, period limit 1
  ),
  summary as (
    select count(*) as count, min(period) as first, max(period) as last,
      jsonb_agg(jsonb_build_object('period', period, 'old_value', old_value, 'new_value', new_value)
        order by period) as changes
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
        concat_ws(', ', v_series.indicator, v_series.region),
        public.format_period(l.period, v_series.frequency),
        public.format_value(l.old_value, v_series.unit),
        public.format_value(l.new_value, v_series.unit))
    else
      format('%s Revisions from %s: %s, %s to %s; largest change: %s, %s → %s',
        s.count,
        v_series.publisher,
        concat_ws(', ', v_series.indicator, v_series.region),
        public.format_period(s.first, v_series.frequency),
        public.format_period(s.last, v_series.frequency),
        public.format_period(l.period, v_series.frequency),
        public.format_value(l.old_value, v_series.unit),
        public.format_value(l.new_value, v_series.unit))
    end,
    case when s.count = 1 then
      s.changes -> 0
    else
      jsonb_build_object('count', s.count,
        'largest', jsonb_build_object('period', l.period, 'old_value', l.old_value, 'new_value', l.new_value),
        'changes', s.changes)
    end
  from summary s
  cross join largest l;

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
