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

// Revisions (ADR 0005): the corrected value replaces the stored one, and the
// Update log keeps the old and the new value.
async function storedValueAt(seriesId: number, period: string) {
  const { data, error } = await visitor.from("series_values").select("value, is_new")
    .eq("series_id", seriesId).eq("period", period);
  if (error) throw error;
  return data;
}

Deno.test("a Publisher revises one past month: the latest value is stored and the Update log shows old and new", async () => {
  await resetCollectedData();
  // FRED's real answers of 9 and 10 January 2020, trimmed to start in May 2018.
  await runNightAt("2020-01-09T22:30:00Z", { fred: { UNRATE: "UNRATE_vintage_2020-01-09_from_2018-05.json" } });

  // FRED publishes December 2019 and revises July 2018 from 3.9% to 3.8%.
  await runNightAt("2020-01-10T22:30:00Z", { fred: { UNRATE: "UNRATE_vintage_2020-01-10_from_2018-05.json" } });

  const id = await unrateSeriesId();
  assertEquals(await storedValueAt(id, "2018-07-01"), [{ value: 3.8, is_new: false }]);
  assertEquals((await storedValues(id)).count, 20);
  const log = await updateLog();
  assertEquals(log.map((e) => [e.kind, e.sentence, e.details]), [
    ["new_value", "History loaded: May 2018 to November 2019", { first: "2018-05-01", last: "2019-11-01", count: 19 }],
    ["new_value", "New value from FRED: Unemployment rate, United States, December 2019: 3.5%", {
      period: "2019-12-01",
      value: 3.5,
    }],
    ["revision", "Revision from FRED: Unemployment rate, United States, July 2018: 3.9% → 3.8%", {
      period: "2018-07-01",
      old_value: 3.9,
      new_value: 3.8,
    }],
  ]);
});

Deno.test("a run that revises several months writes one grouped line with the count and largest change, listing every change", async () => {
  await resetCollectedData();
  // FRED's real answers of 8 and 9 January 2026: the December 2025 release
  // came with the yearly re-estimate of past months.
  await runNightAt("2026-01-08T22:30:00Z", { fred: { UNRATE: "UNRATE_vintage_2026-01-08.json" } });

  await runNightAt("2026-01-09T22:30:00Z", { fred: { UNRATE: "UNRATE_vintage_2026-01-09.json" } });

  const id = await unrateSeriesId();
  assertEquals(await storedValueAt(id, "2025-11-01"), [{ value: 4.5, is_new: false }]);
  assertEquals(await storedValueAt(id, "2025-12-01"), [{ value: 4.4, is_new: true }]);
  const log = await updateLog();
  assertEquals(log.slice(1).map((e) => [e.kind, e.sentence, e.details]), [
    ["new_value", "New value from FRED: Unemployment rate, United States, December 2025: 4.4%", {
      period: "2025-12-01",
      value: 4.4,
    }],
    [
      "revision",
      // Every change is 0.1 point, so the earliest month is named.
      "8 Revisions from FRED: Unemployment rate, United States, November 2021 to November 2025; " +
      "largest change: November 2021, 4.2% → 4.1%",
      {
        count: 8,
        largest: { period: "2021-11-01", old_value: 4.2, new_value: 4.1 },
        changes: [
          { period: "2021-11-01", old_value: 4.2, new_value: 4.1 },
          { period: "2022-02-01", old_value: 3.8, new_value: 3.9 },
          { period: "2023-09-01", old_value: 3.8, new_value: 3.7 },
          { period: "2024-05-01", old_value: 4.0, new_value: 3.9 },
          { period: "2025-02-01", old_value: 4.1, new_value: 4.2 },
          { period: "2025-05-01", old_value: 4.2, new_value: 4.3 },
          { period: "2025-07-01", old_value: 4.2, new_value: 4.3 },
          { period: "2025-11-01", old_value: 4.6, new_value: 4.5 },
        ],
      },
    ],
  ]);
});

Deno.test("a run where the Publisher changed nothing writes nothing to the Update log", async () => {
  await resetCollectedData();
  await runNightAt("2026-11-23T22:30:00Z", { fred: { UNRATE: "UNRATE_through_2026-10.json" } });

  await runNightAt("2026-11-24T22:30:00Z", { fred: { UNRATE: "UNRATE_through_2026-10.json" } });

  assertEquals((await updateLog()).map((e) => e.sentence), ["History loaded: January 1948 to October 2026"]);
});

// A value the Publisher stops giving is kept, and the Update log says so once
// (decided by the Owner on 2026-11-28).
Deno.test("a Publisher stops giving August: the last value stays and the Update log says so once", async () => {
  await resetCollectedData();
  await runNightAt("2026-11-23T22:30:00Z", { fred: { UNRATE: "UNRATE_through_2026-10.json" } });

  await runNightAt("2026-11-24T22:30:00Z", { fred: { UNRATE: "UNRATE_through_2026-10_august_withdrawn.json" } });
  await runNightAt("2026-11-25T22:30:00Z", { fred: { UNRATE: "UNRATE_through_2026-10_august_withdrawn.json" } });

  const id = await unrateSeriesId();
  assertEquals(await storedValueAt(id, "2026-08-01"), [{ value: 4.1, is_new: false }]);
  const log = await updateLog();
  assertEquals(log.slice(1).map((e) => [e.kind, e.sentence, e.details]), [
    [
      "revision",
      "FRED no longer gives a value for Unemployment rate, United States, August 2026; " +
      "Spock keeps the last one it gave: 4.1%",
      { period: "2026-08-01", old_value: 4.1, new_value: null },
    ],
  ]);
});

Deno.test("a Publisher stops giving several months: one grouped line lists them all", async () => {
  await resetCollectedData();
  await runNightAt("2026-11-23T22:30:00Z", { fred: { UNRATE: "UNRATE_through_2026-10.json" } });

  await runNightAt("2026-11-24T22:30:00Z", { fred: { UNRATE: "UNRATE_through_2026-10_july_august_withdrawn.json" } });

  const log = await updateLog();
  assertEquals(log.slice(1).map((e) => [e.kind, e.sentence, e.details]), [
    [
      "revision",
      "FRED no longer gives 2 values of Unemployment rate, United States, July 2026 to August 2026; " +
      "Spock keeps the last ones it gave",
      {
        count: 2,
        changes: [
          { period: "2026-07-01", old_value: 4.1, new_value: null },
          { period: "2026-08-01", old_value: 4.1, new_value: null },
        ],
      },
    ],
  ]);
});

Deno.test("a value given again unchanged writes nothing, and stopping again is logged again", async () => {
  await resetCollectedData();
  await runNightAt("2026-11-23T22:30:00Z", { fred: { UNRATE: "UNRATE_through_2026-10.json" } });
  await runNightAt("2026-11-24T22:30:00Z", { fred: { UNRATE: "UNRATE_through_2026-10_august_withdrawn.json" } });

  // August comes back unchanged, then goes away again.
  await runNightAt("2026-11-25T22:30:00Z", { fred: { UNRATE: "UNRATE_through_2026-10.json" } });
  await runNightAt("2026-11-26T22:30:00Z", { fred: { UNRATE: "UNRATE_through_2026-10_august_withdrawn.json" } });

  const log = await updateLog();
  assertEquals(log.slice(1).map((e) => e.details), [
    { period: "2026-08-01", old_value: 4.1, new_value: null },
    { period: "2026-08-01", old_value: 4.1, new_value: null },
  ]);
});
