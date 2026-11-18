# Decisions: how to work with the owner

The owner, `schaine`, works alone and is not a developer. This file replaces
the developer who would otherwise answer technical questions. Read it before
you ask the owner anything, or need the owner to do anything, in any skill.

## 1. Two kinds of decision

- A **product decision** changes what a user sees, can do, or gets; or what
  the project costs; or what it promises. Ask it in the user's words.
- A **technical decision** needs knowledge of how software is built:
  storage, architecture, libraries, hosting, performance, security.

## 2. Before asking anything

Read the code, the glossary and the ADRs of the area. A consequence you find
in the code becomes a product question:

> "Deleting X also removes Y. Should we delete Y too, keep it, or block the
> deletion?"

## 3. How to ask a technical decision

Do not ask the owner to design. Present it as a choice the owner can judge:

- what is being decided, in one plain sentence;
- two or three options, each with: what the owner will notice, money cost
  (one-off and monthly), risk, and how hard it is to undo later;
- your recommendation and why, first.

The owner answers "ok" or picks another option.

## 4. Small technical choices

If a choice is cheap to undo and changes nothing the owner can notice
(naming, file layout, a small library), make it yourself and mention it in
one line in the PR. Do not ask.

## 5. Recording

A decision that is hard to undo, surprising, or the result of a real
trade-off becomes an ADR in `docs/adr/`, through `/domain-modeling`. Write in
the ADR that the owner approved it and on what date.

## 6. Grouping

In a grill, ask product questions first. Keep technical questions until the
product questions they depend on are settled, then ask them together in one
round.

## 7. When the owner must answer later, or act

If a question cannot be answered in the session, or a step needs the owner
(create an account, pay, accept terms, get an API key):

- write it in an issue, assigned to `schaine`;
- for an action, give numbered click-by-click steps: the exact URL, what to
  click, what to copy, where to paste it;
- never ask the owner to paste a secret (API key, password) in the chat or in
  an issue. Tell the owner where to store it: the Claude Code environment
  settings for the agent's sessions, or the repo's
  *Settings → Secrets and variables → Actions* for CI;
- never ask the owner to run a terminal command;
- give the owner the issue link, and mark every issue that waits on it as
  blocked by it.

When the owner answers in the issue, the next session on it reads the answer,
unassigns the owner, and closes or continues the issue.

## 8. Owner constraints and stack profiles

Confirmed by the owner, unchanged, at setup on 2026-11-18. Apply the
constraints to every technical decision, not only the stack.

### Constraints

- **Budget:** free tiers wherever possible. Before adding any paid service,
  paid plan or paid add-on, state its cost (one-off and monthly) and ask the
  owner. When a free tier has a limit the owner will notice (a project that
  pauses when inactive, a monthly quota), say so when you propose it.
- **Data location:** user data stays in the European Union. Create Supabase
  projects in an EU region. For every other service that stores user data,
  check where it stores it and whether it offers a GDPR data processing
  agreement; tell the owner what you found. If a service cannot meet this,
  say so and propose an alternative. Do not assume: check the service's own
  documentation.
- **Accounts the owner already has:** GitHub, Supabase, Cloudflare, Sanity.
  Prefer them over new services. Every new account is one more thing for the
  owner to manage.
- **Versions:** use the latest stable major version at the time of the
  decision, and record the exact versions in the stack ADR. Do not copy
  version numbers from the setup guide.

### Stack profiles

A profile is the default answer for a type of project. It is a starting
point, not a rule: the stack decision is still made per project, in an ADR.

This project is a **SaaS (web application)**.

#### SaaS (web application)

The owner's current stack.

- Front end: React, TypeScript, Tailwind CSS, shadcn/ui.
- Framework: TanStack Start (includes Vite and TanStack Router).
- Data and UI: TanStack Query, TanStack Table, TanStack Form, TanStack Charts
  (`@tanstack/charts`, with its React adapter). Charts has a stable API since
  1.0 and ships shadcn/ui-style examples: start from those.
- TanStack Charts is recent (first release July 2026, 1.0 in October 2026),
  so your training data may not know it, or may confuse it with the old,
  abandoned `react-charts` package. Before writing chart code, read its
  current docs: every page has a Markdown version at the same URL plus `.md`
  (for example `tanstack.com/charts/latest/docs/overview.md`). Apply the same
  rule to any library whose current major version is newer than what you
  know.
- Back end: Supabase (Postgres database, authentication, storage), EU region.
- Hosting and domain: Cloudflare.
- Reference: in November 2026 the owner's projects used Vite 8, React 19.2,
  TypeScript 6 and Tailwind CSS v4.

#### Website (content, marketing)

- Astro for the site, Sanity for the content the owner edits, hosted on
  Cloudflare.

#### Mobile app (Android + iOS)

No settled profile yet.

- Propose first: Expo (React Native) with TypeScript and Supabase, so the
  owner keeps one language and one back end across projects. Present one or
  two alternatives next to it.
- Say up front that publishing needs an Apple Developer account (yearly fee)
  and a Google Play developer account (one-off fee); give current prices.
- Charts: TanStack Charts' React Native adapter is experimental. If the app
  needs charts, say so and present it as a technical decision (section 3).
- The first mobile project's stack ADR becomes this profile: after it is
  merged, update the mobile profile in that repo's `docs/setup-guide.md`, in
  a pull request, and tell the owner.

#### Any other type

No profile. Present two or three options (see section 9).

## 9. Choosing the tech stack

- *When:* once the product's shape is known (who uses it, on what device,
  what data it keeps) and **before `/to-spec`**, so the spec and tickets are
  written for the chosen stack. In `/wayfinder`, create a ticket "Choose the
  tech stack", blocked by the product decision tickets it depends on. In
  `/grill-with-docs`, ask it at the end, after the product questions.
- *How:* name the project type. If it has a profile, propose the profile and
  ask the owner to confirm it; if part of the profile fits this project
  badly, say which part and why, and present that part as a technical
  decision (section 3). If it has no profile, present two or three options
  using these criteria, in this order: meets the owner constraints; widely
  used, so you know it well; managed hosting with no server to maintain, and
  a preview link on every pull request; fewest services and accounts; free to
  start.
- *Recording:* the result is `docs/adr/0001-tech-stack.md` (or the next free
  number): the stack, the exact versions, the EU region of each service that
  stores user data, the monthly cost at launch, and the owner's approval with
  its date.
- *Accounts:* each account or project to create (for example a Supabase
  project in an EU region) is an issue assigned to the owner, with
  click-by-click steps (section 7).

## 10. When you cannot read the documentation

This applies when a docs page you need is blocked by the network, fails to
load, or does not exist; or when a library's current version is newer than
what you know and you cannot read its current docs.

- Stop before you make the decision or write the code that depends on it.
  Other work that does not depend on it can go on.
- Tell the owner, in plain English: which site or page, why you need it, and
  what you would otherwise have to guess.
- If the network blocked it, propose adding the site to the cloud
  environment's allowed domains; the owner approves on a card. If you cannot
  propose it, give the owner the clicks: the environment name in the
  session's title bar → **Edit** → **Network access** → add the domain under
  **Allowed domains**, keeping **Allow package managers** ticked.
- Do not decide or write code from memory in its place. If the owner
  explicitly says to go on without the docs, do so, and write in the PR (and
  the ADR, if there is one) which docs you could not read.
