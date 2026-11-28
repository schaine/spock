-- Calls the `collect` Edge Function at 23:30 and 05:30 Paris time
-- (docs: supabase.com/docs/guides/functions/schedule-functions).
-- Supabase Cron runs on UTC and Paris is UTC+1 in winter, UTC+2 in summer,
-- so each job fires at both possible UTC times; the function keeps only the
-- call that falls at 23:30 or 05:30 in Paris.
--
-- The function's address and the secret key are read from Supabase Vault,
-- under the names `project_url` and `secret_key`. They are set once by the
-- Owner in the Supabase Dashboard, never in this repository.

create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;

create function public.call_nightly_collection()
returns void
language sql
security definer
set search_path = ''
as $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'project_url')
      || '/functions/v1/collect',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'apikey', (select decrypted_secret from vault.decrypted_secrets where name = 'secret_key')
    ),
    body := '{}'::jsonb,
    -- Wait up to 2.5 minutes, the Edge Function's own limit on the free plan.
    timeout_milliseconds := 150000
  );
$$;

revoke execute on function public.call_nightly_collection() from public, anon, authenticated;

-- 23:30 Paris = 21:30 UTC in summer, 22:30 UTC in winter.
select cron.schedule('nightly-collection', '30 21,22 * * *', 'select public.call_nightly_collection()');
-- 05:30 Paris = 03:30 UTC in summer, 04:30 UTC in winter.
select cron.schedule('nightly-collection-retry', '30 3,4 * * *', 'select public.call_nightly_collection()');
