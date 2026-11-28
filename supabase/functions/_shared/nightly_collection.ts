// The nightly collection: for each Series due tonight, ask its Publisher's
// collector for the values, then record the check in the database, which
// stores new values, replaces revised ones (ADR 0005: latest values only),
// writes the Update log and updates the check status in one transaction.
import type { SupabaseClient } from "npm:@supabase/supabase-js@2.119.2";
import { collectors } from "./collectors/index.ts";
import type { CollectorTools } from "./collectors/collector.ts";

export interface NightlyRunInput extends CollectorTools {
  /** A database client with the collection's rights (the secret key). */
  db: SupabaseClient;
  now: Date;
}

interface SeriesRow {
  id: number;
  publisher_code: string;
  publisher_series_code: string;
  publisher_options: Record<string, unknown>;
  series_checks: { last_success_at: string | null } | null;
}

type Task = "collect" | "retry" | "nothing";

/**
 * Supabase Cron runs on UTC, so it calls the collection at both UTC times
 * that can be 23:30 or 05:30 in Paris (summer and winter time). Paris time
 * decides what each call does.
 */
function taskAt(now: Date): Task {
  const parisHour = Number(
    new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Paris", hour: "2-digit", hourCycle: "h23" }).format(now),
  );
  if (parisHour === 23) return "collect";
  if (parisHour === 5) return "retry";
  return "nothing";
}

/** At 05:30, a Series is collected again only if it has not succeeded since the evening before. */
const RETRY_WINDOW_MS = 12 * 60 * 60 * 1000;

function succeededTonight(series: SeriesRow, now: Date): boolean {
  const lastSuccess = series.series_checks?.last_success_at;
  return lastSuccess != null && now.getTime() - new Date(lastSuccess).getTime() < RETRY_WINDOW_MS;
}

export async function runNightlyCollection({ db, now, fetch, secret }: NightlyRunInput): Promise<void> {
  const task = taskAt(now);
  if (task === "nothing") return;

  const { data, error } = await db
    .from("series")
    .select("id, publisher_code, publisher_series_code, publisher_options, series_checks(last_success_at)")
    .eq("status", "active")
    .order("id");
  if (error) throw error;

  for (const series of data as unknown as SeriesRow[]) {
    if (task === "retry" && succeededTonight(series, now)) continue;
    await checkSeries(db, series, now, { fetch, secret });
  }
}

/** Checks one Series. A failure is recorded, never thrown, so it cannot stop the others. */
async function checkSeries(db: SupabaseClient, series: SeriesRow, now: Date, tools: CollectorTools) {
  try {
    const collector = collectors[series.publisher_code];
    if (!collector) throw new Error(`No collector for the Publisher ${series.publisher_code}.`);
    const values = await collector.collect(
      { publisherSeriesCode: series.publisher_series_code, publisherOptions: series.publisher_options },
      tools,
    );
    const { error } = await db.rpc("record_successful_check", {
      p_series_id: series.id,
      p_values: values,
      p_checked_at: now.toISOString(),
    });
    if (error) throw new Error(`Storing the values failed: ${error.message}`);
  } catch (problem) {
    const message = problem instanceof Error ? problem.message : String(problem);
    const { error } = await db.rpc("record_failed_check", {
      p_series_id: series.id,
      p_error: message,
      p_checked_at: now.toISOString(),
    });
    // Nothing more can be recorded: leave a trace in the function's logs.
    if (error) console.error(`Series ${series.id}: ${message}; recording the failure failed: ${error.message}`);
  }
}
