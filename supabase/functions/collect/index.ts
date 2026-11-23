// The nightly collection's Edge Function, called by Supabase Cron with the
// secret key (see supabase/migrations/*_nightly_schedule.sql).
import { withSupabase } from "npm:@supabase/server@1.9.2";
import { runNightlyCollection } from "../_shared/nightly_collection.ts";

export default {
  fetch: withSupabase({ auth: "secret" }, async (_request, ctx) => {
    await runNightlyCollection({
      db: ctx.supabaseAdmin,
      now: new Date(),
      fetch,
      secret: (name) => Deno.env.get(name),
    });
    return Response.json({ ok: true });
  }),
};
