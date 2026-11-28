# Coding standards

The conventions `/code-review` enforces. Start short; `/retro` adds rules.

## Language and words

- Code, comments, test names and messages are in English.
- Name domain things with the words of `GLOSSARY.md` (Series, Publisher,
  Update log, Visitor...), never the words it lists under "Avoid".
- A comment says why, not what.

## Stack

- The stack and its versions are in `docs/adr/0003-tech-stack.md`. Before
  using a library, read its current docs (`docs/agents/decisions.md`,
  section 10).
- TypeScript everywhere. Edge Functions run on Deno: import packages with a
  pinned version (`npm:@supabase/supabase-js@2.119.2`, `jsr:@std/assert@1.0.19`).
- Database changes are SQL files in `supabase/migrations/`, one per change,
  never edited once merged. Reference rows every environment needs (a
  Region, an Indicator, a Series) go in a migration too; `seed.sql` is for
  local-only data.

## Data collection

- One collector per Publisher, behind the `Collector` interface in
  `supabase/functions/_shared/collectors/collector.ts`. Storing values, the
  Update log and check status are shared code; a collector only fetches and
  reads its Publisher's answer.
- Never invent or fill in a value: a period without a value is left out.
- Keys come from Edge Function secrets (`secret("FRED_API_KEY")`), never from
  the code. An error message must never contain a key or a URL holding one.

## Database access

- Every table has row level security on. Visitors (`anon`) may only read,
  through a select policy; no table has a write policy for `anon` or
  `authenticated`. Only the collection, with the secret key, writes.
- A column with technical detail (error text) is hidden from Visitors with
  column grants.

## Tests

- Tests use the one seam approved by the Owner (spec #15, Testing
  Decisions): a whole nightly run, Publishers replaced by saved answers in
  `supabase/functions/tests/saved_answers/`, a test database, and checks on
  what a Visitor or the Owner can see. No test of inner functions, no mock of
  the database.
- Saved answers are real Publisher answers, trimmed; say how each was made
  in the folder's `README.md`.
- Test names describe behaviour in plain words: "the 05:30 retry does nothing
  after a successful night".
- Run the tests with `scripts/test.sh` after `supabase start`. CI runs them on
  every pull request (the `test` check).
