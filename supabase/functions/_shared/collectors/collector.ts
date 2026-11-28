// The one interface every Publisher's collector follows. A later Publisher
// only adds a collector (and registers it in `collectors/index.ts`); storing,
// the Update log and check status are shared (see `nightly_collection.ts`).

/** What a collector needs to know about one Series. */
export interface SeriesToCollect {
  /** The Publisher's own label, such as `UNRATE` at FRED. */
  publisherSeriesCode: string;
  /** Extra request options, such as Eurostat filters. */
  publisherOptions: Record<string, unknown>;
}

/** One dated value, as the Publisher gives it today. */
export interface Observation {
  /** First day of the period, as `YYYY-MM-DD`. */
  period: string;
  value: number;
}

export interface CollectorTools {
  fetch: typeof fetch;
  /** Reads a private setting (an Edge Function secret), such as `FRED_API_KEY`. */
  secret: (name: string) => string | undefined;
}

export interface Collector {
  /**
   * Returns every value the Publisher has for the Series. Periods without a
   * value are left out, never filled in. Throws when the Publisher cannot be
   * read; the error message must never contain a key.
   */
  collect(series: SeriesToCollect, tools: CollectorTools): Promise<Observation[]>;
}
