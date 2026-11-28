# Saved FRED answers

Answers of FRED's `fred/series/observations` API (JSON), used by the tests in place of the live Publisher.

- `UNRATE_through_2026-10.json`: `UNRATE` up to October 2026.
- `UNRATE_through_2026-09.json`: the same answer without its last month, as FRED answered before the October 2026
  release.
- `UNRATE_vintage_2020-01-09_from_2018-05.json` and `UNRATE_vintage_2020-01-10_from_2018-05.json`: `UNRATE` as FRED
  gave it on 9 and 10 January 2020, both trimmed to start in May 2018. The second adds December 2019 and revises one
  month left in the trimmed window: July 2018, from 3.9 to 3.8.
- `UNRATE_vintage_2026-01-08.json` and `UNRATE_vintage_2026-01-09.json`: `UNRATE` as FRED gave it on 8 and 9 January
  2026, in full. The second adds December 2025 and revises eight past months (FRED's yearly re-estimate).
- `UNRATE_through_2026-10_august_withdrawn.json` and `UNRATE_through_2026-10_july_august_withdrawn.json`:
  `UNRATE_through_2026-10.json` with August 2026 (and July 2026) written `.`, FRED's mark for "no value", to stand for
  a Publisher that stops giving a value it published earlier.

How the `UNRATE_through_` answers were made, on 2026-11-23: the values are FRED's real `UNRATE` values, downloaded from
FRED's public file (`fred.stlouisfed.org/graph/fredgraph.csv?id=UNRATE`), and written in the answer shape documented on
FRED's [series/observations page](https://fred.stlouisfed.org/docs/api/fred/series_observations.html). The API itself
needs the key, which lives only in Supabase. October 2025 has no value (FRED writes `.`): the US government shutdown
stopped that survey.

How the `UNRATE_vintage_` answers were made, on 2026-11-28: the values are FRED's own past answers, downloaded from
ALFRED, FRED's archive of what it published on each day
(`alfred.stlouisfed.org/graph/alfredgraph.csv?id=UNRATE&vintage_date=2026-01-09`), and written in the same answer
shape, with `realtime_start` and `realtime_end` set to that day. An empty ALFRED cell is written `.`, as the API does.

The two `_withdrawn` answers are edited, not downloaded: in ALFRED's versions of `UNRATE` of mid-month 2005 to 2026, FRED never
stopped giving a value it had published, so there is no real answer to save. They are the only saved answers that are
not real.
