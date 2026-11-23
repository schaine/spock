# Saved FRED answers

Answers of FRED's `fred/series/observations` API (JSON), used by the tests in place of the live Publisher.

- `UNRATE_through_2026-10.json`: `UNRATE` up to October 2026.
- `UNRATE_through_2026-09.json`: the same answer without its last month, as FRED answered before the October 2026
  release.

How they were made, on 2026-11-23: the values are FRED's real `UNRATE` values, downloaded from FRED's public file
(`fred.stlouisfed.org/graph/fredgraph.csv?id=UNRATE`), and written in the answer shape documented on FRED's
[series/observations page](https://fred.stlouisfed.org/docs/api/fred/series_observations.html). The API itself needs the
key, which lives only in Supabase. October 2025 has no value (FRED writes `.`): the US government shutdown stopped that
survey.
