-- Stops the first publish if the Spock project already holds tables,
-- functions or types made by hand in Supabase's web console: the migrations
-- would clash with them or silently live next to them.
-- Once the first publish has filled the migration history, this does nothing.
do $$
declare
  hand_made text;
begin
  -- Nested: Postgres reads the whole condition at once, so the table must
  -- be known to exist before the second test mentions it.
  if to_regclass('supabase_migrations.schema_migrations') is not null then
    if exists (select 1 from supabase_migrations.schema_migrations) then
      return;
    end if;
  end if;

  select string_agg(name, ', ' order by name) into hand_made
  from (
    select relname::text as name from pg_class
    where relnamespace = 'public'::regnamespace and relkind in ('r', 'p', 'v', 'm', 'f', 'S')
    union all
    select proname::text || '()' from pg_proc
    where pronamespace = 'public'::regnamespace
    union all
    select typname::text from pg_type
    where typnamespace = 'public'::regnamespace and typtype in ('e', 'd', 'r')
  ) as hand_made_objects;

  if hand_made is not null then
    raise exception 'First publish stopped: the Spock project already has objects in its public schema (%). Compare them with supabase/migrations/ (Supabase docs: supabase db pull) before publishing.', hand_made;
  end if;
end
$$;
