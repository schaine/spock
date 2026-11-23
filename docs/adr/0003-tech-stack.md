# Tech stack

Spock is a web application, so it uses the Owner's SaaS profile (`docs/agents/decisions.md`, section 8), with two adjustments: the daily data collection runs in Supabase rather than Cloudflare, and the Owner's private connector runs on Cloudflare. Monthly cost at launch: €0.

Approved by the Owner, `schaine`, on 2026-11-18, during the first grill (issue #2).

## Stack

Versions are the latest stable releases on npm on 2026-11-18.

| Part | Choice | Version |
| --- | --- | --- |
| Language | TypeScript | 7.0.2 |
| UI | React | 19.3.1 |
| Framework | TanStack Start (with TanStack Router), on Vite | 1.169.5 (Router 1.170.46), Vite 8.3.8 |
| Styling | Tailwind CSS | 4.3.5 |
| Components | shadcn/ui, fully restyled to the Owner's design system | CLI 4.23.0 |
| Data fetching | TanStack Query | 5.108.0 |
| Tables | TanStack Table | 9.3.1 |
| Forms | TanStack Form | 1.33.5 |
| Charts | TanStack Charts (`@tanstack/charts`, `@tanstack/react-charts`) | 1.5.0 |
| Database, Owner login, scheduled jobs | Supabase (Postgres, Auth, Cron, Edge Functions), `supabase-js` | 2.119.1, CLI 3.2.0 |
| Hosting | Cloudflare Workers, deployed with Wrangler | 4.165.0 |
| Owner's private connector | MCP server on Cloudflare Workers, `@modelcontextprotocol/sdk`, `agents`, `@cloudflare/workers-oauth-provider` | 1.32.2, 0.33.0, 1.2.4 |

### Versions added with the first code (2026-11-23, ticket #16)

Latest stable releases on npm and JSR that day. Small choices under
`docs/agents/decisions.md` section 4, listed here so the versions stay in
one place.

| Part | Choice | Version |
| --- | --- | --- |
| Edge Functions runtime and test tool | Deno, with its built-in test runner and `@std/assert` | 2.9.6, `@std/assert` 1.0.19 |
| Supabase client and CLI | `supabase-js`, Supabase CLI (replace 2.119.1 and 3.2.0 above) | 2.119.2, 3.3.0 |
| Edge Function key check | `@supabase/server` | 1.9.2 |
| Test database cleanup | `postgres` (npm) | 4.1.1 |

## Where data is stored

- Supabase project in the **West EU (Paris)** region, `eu-west-3`, in the Owner's `sch-design` organization. It holds Indicators, Flags and Insights. The only personal data is the Owner's own login: Visitors have no accounts.
- Cloudflare serves the pages worldwide. The connector's login tokens, for the Owner only, are stored in Cloudflare Workers KV.

## Choices within the profile

- **Daily data collection** is a Supabase Cron job calling an Edge Function, not a Cloudflare Cron Trigger. Cloudflare's free plan allows 10 ms of CPU time per run; a Supabase Edge Function allows 2 s, which large statistical files need.
- **Cloudflare Workers Free plan at launch.** The free plan allows 10 ms of CPU time per request, and Cloudflare's docs say server-rendered pages often use 10 to 20 ms. Pages therefore send data and let the browser draw charts, keeping server work small. If requests fail on that limit, the Owner moves to Workers Paid ($5 per month), which the Owner accepted in advance.
- **Supabase Free plan.** A free project is paused after a week of low database activity; the daily data collection is expected to keep it active.
- **Designs** come from Claude Design through its handoff bundle to Claude Code.

## Considered options

- Cloudflare Workers Paid from day one ($5 per month): rejected until the free limit proves to be a real problem.
- Pre-building the public pages once a day: rejected as an extra step that can break.
