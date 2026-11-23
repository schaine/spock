// FRED, the St. Louis Fed's data service. Docs:
// https://fred.stlouisfed.org/docs/api/fred/series_observations.html
import type { Collector } from "./collector.ts";

const OBSERVATIONS_URL = "https://api.stlouisfed.org/fred/series/observations";

interface FredAnswer {
  observations: { date: string; value: string }[];
}

export const fredCollector: Collector = {
  async collect(series, { fetch, secret }) {
    const key = secret("FRED_API_KEY");
    if (!key) throw new Error("The FRED_API_KEY setting is missing in Supabase.");

    const url = new URL(OBSERVATIONS_URL);
    url.searchParams.set("series_id", series.publisherSeriesCode);
    url.searchParams.set("api_key", key);
    url.searchParams.set("file_type", "json");

    let response: Response;
    try {
      response = await fetch(url);
    } catch {
      // Network errors name the URL, which holds the key: keep them out.
      throw new Error(`FRED could not be reached for ${series.publisherSeriesCode}.`);
    }
    if (!response.ok) {
      await response.body?.cancel();
      // The URL holds the key: keep it out of the message.
      throw new Error(`FRED answered ${response.status} for ${series.publisherSeriesCode}.`);
    }
    const answer = await response.json() as FredAnswer;
    // FRED writes "." for a period with no value.
    return answer.observations
      .filter((o) => o.value !== ".")
      .map((o) => ({ period: o.date, value: Number(o.value) }));
  },
};
