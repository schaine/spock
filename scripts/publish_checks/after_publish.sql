-- Fails the publish run if what the migrations should have created is not
-- in the Spock project: the collection tables, the UNRATE Series and the two
-- Cron jobs of the nightly collection.
do $$
declare
  missing text[] := '{}';
  table_name text;
  job_name text;
begin
  foreach table_name in array array[
    'regions', 'publishers', 'indicators', 'series',
    'series_values', 'series_checks', 'update_log'
  ] loop
    if to_regclass('public.' || table_name) is null then
      missing := missing || ('table ' || table_name);
    end if;
  end loop;

  -- Nested: Postgres reads the whole condition at once, so the table must
  -- be known to exist before the second test mentions it.
  if to_regclass('public.series') is not null then
    if not exists (select 1 from public.series where publisher_series_code = 'UNRATE') then
      missing := missing || 'Series UNRATE'::text;
    end if;
  end if;

  if to_regclass('cron.job') is null then
    missing := missing || 'Supabase Cron'::text;
  else
    foreach job_name in array array['nightly-collection', 'nightly-collection-retry'] loop
      if not exists (select 1 from cron.job where jobname = job_name and active) then
        missing := missing || ('Cron job ' || job_name);
      end if;
    end loop;
  end if;

  if cardinality(missing) > 0 then
    raise exception 'Publish incomplete, missing in the Spock project: %', array_to_string(missing, ', ');
  end if;
end
$$;
