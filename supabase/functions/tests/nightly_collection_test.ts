// The nightly collection, tested as a whole: a run fed with saved Publisher
// answers, checked on what a Visitor can see (spec #15, Testing Decisions).
import { assert, assertEquals } from "jsr:@std/assert@1.0.19";
import { owner, resetCollectedData, runNightAt, TEST_FRED_KEY, visitor } from "./harness.ts";

// 23:30 in Paris on 23 November 2026 (winter time, UTC+1).
const WINTER_NIGHT = "2026-11-23T22:30:00Z";

async function unrateSeriesId() {
  const { data, error } = await visitor
    .from("series")
    .select("id")
    .eq("publisher_code", "FRED")
    .eq("publisher_series_code", "UNRATE")
    .single();
  if (error) throw error;
  return data.id as number;
}

async function storedValues(seriesId: number) {
  const { count } = await visitor
    .from("series_values")
    .select("*", { count: "exact", head: true })
    .eq("series_id", seriesId);
  const first = await visitor.from("series_values").select("period, value")
    .eq("series_id", seriesId).order("period").limit(1).single();
  const last = await visitor.from("series_values").select("period, value")
    .eq("series_id", seriesId).order("period", { ascending: false }).limit(1).single();
  return { count, first: first.data, last: last.data };
}

async function updateLog() {
  const { data, error } = await visitor
    .from("update_log")
    .select("kind, sentence, details, series_id")
    .order("id");
  if (error) throw error;
  return data;
}

Deno.test("the first run stores UNRATE's full history and writes one History loaded line", async () => {
  await resetCollectedData();

  await runNightAt(WINTER_NIGHT, { fred: { UNRATE: "UNRATE_through_2026-10.json" } });

  const id = await unrateSeriesId();
  // 946 months from January 1948 to October 2026, minus October 2025 (no value).
  assertEquals(await storedValues(id), {
    count: 945,
    first: { period: "1948-01-01", value: 3.4 },
    last: { period: "2026-10-01", value: 4.1 },
  });
  const log = await updateLog();
  assertEquals(log.map((e) => [e.kind, e.sentence, e.series_id]), [
    ["new_value", "History loaded: January 1948 to October 2026", id],
  ]);
});

Deno.test("a later run stores the new month, marks it as new and writes one new value line", async () => {
  await resetCollectedData();
  await runNightAt("2026-11-05T22:30:00Z", { fred: { UNRATE: "UNRATE_through_2026-09.json" } });

  await runNightAt(WINTER_NIGHT, { fred: { UNRATE: "UNRATE_through_2026-10.json" } });

  const id = await unrateSeriesId();
  const { data: newValues } = await visitor.from("series_values").select("period, value")
    .eq("series_id", id).eq("is_new", true);
  assertEquals(newValues, [{ period: "2026-10-01", value: 4.1 }]);
  assertEquals((await storedValues(id)).count, 945);
  const log = await updateLog();
  assertEquals(log.map((e) => [e.kind, e.sentence]), [
    ["new_value", "History loaded: January 1948 to September 2026"],
    ["new_value", "New value from FRED: Unemployment rate, United States, October 2026: 4.1%"],
  ]);
});

async function checkStatus(seriesId: number) {
  const { data, error } = await visitor.from("series_checks")
    .select("last_checked_at, last_success_at, consecutive_failed_nights")
    .eq("series_id", seriesId).single();
  if (error) throw error;
  return {
    lastChecked: new Date(data.last_checked_at).toISOString(),
    lastSuccess: new Date(data.last_success_at).toISOString(),
    failedNights: data.consecutive_failed_nights,
  };
}

Deno.test("each Series records when it was last checked and when it last succeeded", async () => {
  await resetCollectedData();
  await runNightAt(WINTER_NIGHT, { fred: { UNRATE: "UNRATE_through_2026-10.json" } });
  const id = await unrateSeriesId();
  assertEquals(await checkStatus(id), {
    lastChecked: "2026-11-23T22:30:00.000Z",
    lastSuccess: "2026-11-23T22:30:00.000Z",
    failedNights: 0,
  });

  // The next night, FRED is down.
  await runNightAt("2026-11-24T22:30:00Z", { fred: { UNRATE: { status: 503 } } });

  assertEquals(await checkStatus(id), {
    lastChecked: "2026-11-24T22:30:00.000Z",
    lastSuccess: "2026-11-23T22:30:00.000Z",
    failedNights: 1,
  });
  assertEquals((await storedValues(id)).count, 945);
});

Deno.test("a Visitor can read what the collection stored but can write nothing", async () => {
  await resetCollectedData();
  await runNightAt(WINTER_NIGHT, { fred: { UNRATE: "UNRATE_through_2026-10.json" } });
  const id = await unrateSeriesId();
  const before = await storedValues(id);

  const attempts = [
    await visitor.from("series_values").insert({ series_id: id, period: "2026-11-01", value: 9.9 }),
    await visitor.from("series_values").update({ value: 9.9 }).eq("series_id", id),
    await visitor.from("series_values").delete().eq("series_id", id),
    await visitor.from("update_log").insert({ kind: "new_value", series_id: id, sentence: "Fake" }),
    await visitor.from("series_checks").update({ consecutive_failed_nights: 0 }).eq("series_id", id),
    await visitor.from("series").update({ status: "coming_soon" }).eq("id", id),
    await visitor.from("indicators").insert({ number: 99, name: "Fake", core_family: "x", timing: "leading" }),
    await visitor.rpc("record_successful_check", {
      p_series_id: id,
      p_values: [{ period: "2026-11-01", value: 9.9 }],
      p_checked_at: "2026-11-24T22:30:00Z",
    }),
    await visitor.rpc("record_failed_check", {
      p_series_id: id,
      p_error: "Fake",
      p_checked_at: "2026-11-24T22:30:00Z",
    }),
  ];

  for (const attempt of attempts) assert(attempt.error, `A Visitor's write was accepted: ${JSON.stringify(attempt)}`);
  assertEquals(await storedValues(id), before);
  assertEquals((await updateLog()).length, 1);
  // The technical error text is for the Owner only.
  assert((await visitor.from("series_checks").select("last_error")).error);
});

// Supabase Cron runs on UTC, so the collection is called at both possible
// UTC times of 23:30 and 05:30 Paris time, and only the right one collects.
Deno.test("the collection runs at 23:30 Paris time in summer and winter, and at no other call", async () => {
  const saved = { fred: { UNRATE: "UNRATE_through_2026-10.json" } };
  const fredRequests = async (moment: string) => {
    await resetCollectedData();
    return (await runNightAt(moment, saved)).requests.length;
  };

  assertEquals(await fredRequests("2026-07-15T21:30:00Z"), 1, "23:30 in Paris, summer time");
  assertEquals(await fredRequests("2026-07-15T22:30:00Z"), 0, "00:30 in Paris, summer time");
  assertEquals(await fredRequests("2026-11-23T22:30:00Z"), 1, "23:30 in Paris, winter time");
  assertEquals(await fredRequests("2026-11-23T21:30:00Z"), 0, "22:30 in Paris, winter time");
  // The night clocks go forward (29 March 2026) and back (25 October 2026).
  assertEquals(await fredRequests("2026-03-28T22:30:00Z"), 1, "23:30 in Paris before clocks go forward");
  assertEquals(await fredRequests("2026-10-24T21:30:00Z"), 1, "23:30 in Paris before clocks go back");
});

Deno.test("the 05:30 retry does nothing after a successful night", async () => {
  await resetCollectedData();
  await runNightAt(WINTER_NIGHT, { fred: { UNRATE: "UNRATE_through_2026-10.json" } });

  // 05:30 in Paris the next morning.
  const retry = await runNightAt("2026-11-24T04:30:00Z", { fred: { UNRATE: "UNRATE_through_2026-10.json" } });

  assertEquals(retry.requests.length, 0);
});

Deno.test("the 05:30 retry collects a Series whose 23:30 check failed", async () => {
  await resetCollectedData();
  await runNightAt(WINTER_NIGHT, { fred: { UNRATE: { status: 503 } } });

  await runNightAt("2026-11-24T04:30:00Z", { fred: { UNRATE: "UNRATE_through_2026-10.json" } });

  const id = await unrateSeriesId();
  assertEquals((await storedValues(id)).count, 945);
  assertEquals(await checkStatus(id), {
    lastChecked: "2026-11-24T04:30:00.000Z",
    lastSuccess: "2026-11-24T04:30:00.000Z",
    failedNights: 0,
  });
});

Deno.test("the 05:30 retry also runs in summer time", async () => {
  await resetCollectedData();
  await runNightAt("2026-07-15T21:30:00Z", { fred: { UNRATE: { status: 503 } } });

  const retry = await runNightAt("2026-07-16T03:30:00Z", { fred: { UNRATE: "UNRATE_through_2026-10.json" } });
  const wrongHour = await runNightAt("2026-07-16T04:30:00Z", { fred: { UNRATE: "UNRATE_through_2026-10.json" } });

  assertEquals([retry.requests.length, wrongHour.requests.length], [1, 0]);
});

Deno.test("a night counts as one failed night even when the 05:30 retry fails too", async () => {
  await resetCollectedData();
  const down = { fred: { UNRATE: { status: 503 } } };
  await runNightAt(WINTER_NIGHT, down);
  await runNightAt("2026-11-24T04:30:00Z", down);
  const id = await unrateSeriesId();
  assertEquals((await checkStatus(id)).failedNights, 1);

  await runNightAt("2026-11-24T22:30:00Z", down);

  assertEquals((await checkStatus(id)).failedNights, 2);
});

Deno.test("when FRED cannot be reached, the error kept for the Owner never holds the FRED key", async () => {
  await resetCollectedData();

  await runNightAt(WINTER_NIGHT, { fred: { UNRATE: "unreachable" } });

  const { data, error } = await owner.from("series_checks").select("last_error").single();
  if (error) throw error;
  assert(data.last_error, "The failure was not recorded");
  assert(!data.last_error.includes(TEST_FRED_KEY), `The key was stored: ${data.last_error}`);
});
