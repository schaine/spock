// The nightly collection: for each active Series, ask its Publisher's
// collector for the values, store the new ones (ADR 0005: latest values only)
// and write the Update log.
import type { SupabaseClient } from "npm:@supabase/supabase-js@2.119.2";
import { collectors } from "./collectors/index.ts";
import type { Observation } from "./collectors/collector.ts";

export interface NightlyRunInput {
  /** A database client with the collection's rights (the secret key). */
  db: SupabaseClient;
  now: Date;
  /** Used by collectors to reach the Publishers. */
  fetch: typeof fetch;
  secret: (name: string) => string | undefined;
}

interface SeriesRow {
  id: number;
  publisher_code: string;
  publisher_series_code: string;
  publisher_options: Record<string, unknown>;
  frequency: string;
  unit: string;
  indicators: { name: string };
  regions: { name: string } | null;
  publishers: { name: string };
  series_checks: { last_success_at: string | null } | null;
}

/**
 * Supabase Cron runs on UTC, so it calls the collection at both UTC times
 * that can be 23:30 or 05:30 in Paris (summer and winter time). Paris time
 * decides what each call does.
 */
function whatToDo(now: Date): "collect" | "retry" | "nothing" {
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
  const task = whatToDo(now);
  if (task === "nothing") return;

  const { data: seriesList, error } = await db
    .from("series")
    .select(
      "id, publisher_code, publisher_series_code, publisher_options, frequency, unit, " +
        "indicators(name), regions(name), publishers(name), series_checks(last_success_at)",
    )
    .eq("status", "active")
    .order("id");
  if (error) throw error;

  for (const series of seriesList as unknown as SeriesRow[]) {
    if (task === "retry" && succeededTonight(series, now)) continue;
    // One Series failing must not stop the others.
    try {
      const observations = await collectors[series.publisher_code].collect(
        { publisherSeriesCode: series.publisher_series_code, publisherOptions: series.publisher_options },
        { fetch, secret },
      );
      const firstLoad = !(await hasValues(db, series.id));
      const stored = await storeNewValues(db, series.id, observations);
      await logNewValues(db, series, stored, firstLoad);
      await recordCheck(db, series.id, now, null);
    } catch (problem) {
      await recordCheck(db, series.id, now, problem instanceof Error ? problem.message : String(problem));
    }
  }
}

/** Updates the Series' check status: a success (`error` null) or a failure. */
async function recordCheck(db: SupabaseClient, seriesId: number, now: Date, error: string | null) {
  const at = now.toISOString();
  let row;
  if (error === null) {
    row = { series_id: seriesId, last_checked_at: at, last_success_at: at, consecutive_failures: 0, last_error: null };
  } else {
    const { data, error: readError } = await db.from("series_checks")
      .select("consecutive_failures").eq("series_id", seriesId).maybeSingle();
    if (readError) throw readError;
    row = {
      series_id: seriesId,
      last_checked_at: at,
      consecutive_failures: (data?.consecutive_failures ?? 0) + 1,
      last_error: error,
    };
  }
  const { error: writeError } = await db.from("series_checks").upsert(row);
  if (writeError) throw writeError;
}

/** The first load is one line; after that, one line per new value. */
async function logNewValues(db: SupabaseClient, series: SeriesRow, stored: Observation[], firstLoad: boolean) {
  if (stored.length === 0) return;
  if (firstLoad) {
    const first = stored[0].period;
    const last = stored[stored.length - 1].period;
    await writeLog(db, [{
      kind: "new_value",
      series_id: series.id,
      sentence: `History loaded: ${formatPeriod(first, series.frequency)} to ${formatPeriod(last, series.frequency)}`,
      details: { first, last, count: stored.length },
    }]);
    return;
  }
  const where = [series.indicators.name, series.regions?.name].filter(Boolean).join(", ");
  await writeLog(
    db,
    stored.map((o) => ({
      kind: "new_value",
      series_id: series.id,
      sentence: `New value from ${series.publishers.name}: ${where}, ${formatPeriod(o.period, series.frequency)}: ${
        formatValue(o.value, series.unit)
      }`,
      details: { period: o.period, value: o.value },
    })),
  );
}

async function hasValues(db: SupabaseClient, seriesId: number): Promise<boolean> {
  const { count, error } = await db.from("series_values")
    .select("*", { count: "exact", head: true })
    .eq("series_id", seriesId);
  if (error) throw error;
  return (count ?? 0) > 0;
}

async function storeNewValues(db: SupabaseClient, seriesId: number, observations: Observation[]) {
  const { data, error } = await db.rpc("store_new_values", { p_series_id: seriesId, p_values: observations });
  if (error) throw error;
  return data as Observation[];
}

async function writeLog(
  db: SupabaseClient,
  entries: { kind: string; series_id: number; sentence: string; details: Record<string, unknown> }[],
) {
  const { error } = await db.from("update_log").insert(entries);
  if (error) throw error;
}

/** "January 1948" for a monthly Series. */
function formatPeriod(period: string, _frequency: string): string {
  return new Date(`${period}T00:00:00Z`).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatValue(value: number, unit: string): string {
  return unit === "percent" ? `${value}%` : `${value} ${unit}`;
}
