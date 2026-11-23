// What the tests need around a nightly run: a test database, saved Publisher
// answers in place of the live Publishers, and a Visitor's view of the result.
import { createClient } from "npm:@supabase/supabase-js@2.119.2";
import postgres from "npm:postgres@4.1.1";
import { runNightlyCollection } from "../_shared/nightly_collection.ts";

const env = (name: string): string => {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`${name} is not set: start the test database first (see README.md, "Running the tests").`);
  }
  return value;
};

const url = env("SUPABASE_URL");

/** What any Visitor (no account) can read or try to write. */
export const visitor = createClient(url, env("SUPABASE_PUBLISHABLE_KEY"));

const collection = createClient(url, env("SUPABASE_SECRET_KEY"));

/** What the Owner can read with the secret key, such as the technical error text. */
export const owner = collection;

export const TEST_FRED_KEY = "testkeytestkeytestkeytestkey1234";

/** Empties what the collection writes, so each test starts from a fresh database. */
export async function resetCollectedData(): Promise<void> {
  const sql = postgres(env("SUPABASE_DB_URL"), { onnotice: () => {} });
  try {
    await sql`truncate public.series_values, public.series_checks, public.update_log restart identity`;
  } finally {
    await sql.end();
  }
}

/** A saved answer, a Publisher error status, or a Publisher that cannot be reached at all. */
export type SavedAnswer = string | { status: number } | "unreachable";

/**
 * Runs the nightly collection exactly as in production, at the given moment,
 * except that Publishers answer from the saved files in `saved_answers/`.
 * `fred` maps a FRED series code to the saved answer FRED gives tonight.
 */
export async function runNightAt(
  isoMoment: string,
  saved: { fred: Record<string, SavedAnswer> },
): Promise<{ requests: URL[] }> {
  const requests: URL[] = [];
  const fakeFetch = async (input: string | URL | Request): Promise<Response> => {
    const requestUrl = new URL(input instanceof Request ? input.url : input);
    if (requestUrl.hostname !== "api.stlouisfed.org") throw new Error(`Unexpected request to ${requestUrl.hostname}`);
    requests.push(requestUrl);
    if (requestUrl.searchParams.get("api_key") !== TEST_FRED_KEY) {
      return new Response('{"error_code":400}', { status: 400 });
    }
    const answer = saved.fred[requestUrl.searchParams.get("series_id") ?? ""];
    if (answer === undefined) throw new Error(`No saved FRED answer for ${requestUrl}`);
    // Like Deno's own network errors, the message names the address asked for.
    if (answer === "unreachable") throw new TypeError(`error sending request for url (${requestUrl})`);
    if (typeof answer !== "string") return new Response("{}", { status: answer.status });
    const body = await Deno.readTextFile(new URL(`./saved_answers/fred/${answer}`, import.meta.url));
    return new Response(body, { status: 200, headers: { "content-type": "application/json" } });
  };
  await runNightlyCollection({
    db: collection,
    now: new Date(isoMoment),
    fetch: fakeFetch as typeof fetch,
    secret: (name) => (name === "FRED_API_KEY" ? TEST_FRED_KEY : undefined),
  });
  return { requests };
}
