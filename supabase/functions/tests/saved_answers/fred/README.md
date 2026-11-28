# Saved FRED answers

Answers of FRED's `fred/series/observations` API (JSON), used by the tests in place of the live Publisher.

- `UNRATE_through_2026-10.json`: `UNRATE` up to October 2026.
- `UNRATE_through_2026-09.json`: the same answer without its last month, as FRED answered before the October 2026
  release.
- `UNRATE_through_2026-10_september_revised.json`: `UNRATE_through_2026-10.json` with September 2026 changed from 4.2
  to 4.3, to stand for a single Revision.
- `UNRATE_through_2026-10_2026_revised.json`: `UNRATE_through_2026-10.json` with four 2026 months changed (January 4.3
  to 4.4, March 4.3 to 4.2, June 4.2 to 4.4, August 4.1 to 4.0), to stand for a run with several Revisions.
- `UNRATE_through_2026-10_august_withdrawn.json` and `UNRATE_through_2026-10_july_august_withdrawn.json`:
  `UNRATE_through_2026-10.json` with August 2026 (and July 2026) written `.`, FRED's mark for "no value", to stand for
  a Publisher that stops giving a value it published earlier.

How they were made, on 2026-11-23: the values are FRED's real `UNRATE` values, downloaded from FRED's public file
(`fred.stlouisfed.org/graph/fredgraph.csv?id=UNRATE`), and written in the answer shape documented on FRED's
[series/observations page](https://fred.stlouisfed.org/docs/api/fred/series_observations.html). The API itself needs the
key, which lives only in Supabase. October 2025 has no value (FRED writes `.`): the US government shutdown stopped that
survey.

The `_revised` and `_withdrawn` answers were made on 2026-11-28 by editing those values in the real answer, not downloaded: FRED
keeps its past answers in ALFRED (`alfred.stlouisfed.org`), which the cloud session could not read that day. Replace
them with real ALFRED answers from before and after a real Revision when it can be read.
