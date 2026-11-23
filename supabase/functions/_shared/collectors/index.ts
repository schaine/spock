import type { Collector } from "./collector.ts";
import { fredCollector } from "./fred.ts";

/** The collector of each Publisher, by the Publisher's code in the database. */
export const collectors: Record<string, Collector> = {
  FRED: fredCollector,
};
