# Solo Project Repo Setup Guide

> **For the human:** see "Start a new project" in the README of any repo set
> up with this guide. In short: create a GitHub repo, open a Claude Code
> **Cloud** session on it from Claude Desktop, attach this file, and say:
> "Set up this repo following this guide."

This guide is for an AI agent. It sets up a GitHub repository for a **solo
owner who is not a developer** and who works **only in English**. The agent
(Claude Code) supports the thinking, writes the documents, and later writes
the code. The owner makes the decisions and merges the pull requests.

Read the whole guide before you write anything. Follow the steps in order.
Do not create anything a step does not ask for.

## Who you work for

- **One person**, the owner. No team and no other reviewer.
- **Not a developer.** The owner cannot read code and does not use a
  terminal. The owner judges results: what the product does, what it costs,
  what can go wrong.
- **English only.** Write every file, issue, PR, commit message and answer in
  English, even when a skill or the owner uses another language.
- **Cloud sessions only**, from Claude Desktop. Anything saved outside the
  repo or GitHub is lost when the session's machine is reclaimed.

## Owner defaults

These hold for every project of this owner. At Step 0, show them to the owner
and ask only whether they still hold. Copy them into
`docs/agents/decisions.md` (sections 8 and 9).

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
  version numbers from this guide.

### Stack profiles

A profile is the default answer for a type of project. It is a starting
point, not a rule: the stack decision is still made per project, in an ADR.

**SaaS (web application)**: the owner's current stack.
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

**Website (content, marketing)**
- Astro for the site, Sanity for the content the owner edits, hosted on
  Cloudflare.

**Mobile app (Android + iOS)**: no settled profile yet.
- Propose first: Expo (React Native) with TypeScript and Supabase, so the
  owner keeps one language and one back end across projects. Present one or
  two alternatives next to it.
- Say up front that publishing needs an Apple Developer account (yearly fee)
  and a Google Play developer account (one-off fee); give current prices.
- Charts: TanStack Charts' React Native adapter is experimental. If the app
  needs charts, say so and present it as a technical decision (section 3 of
  `decisions.md`).
- The first mobile project's stack ADR becomes this profile: after it is
  merged, update this section in that repo's `docs/setup-guide.md`, in a
  pull request, and tell the owner.

**Any other type**: no profile. Present two or three options (see
"Choosing the tech stack" in `decisions.md`).

## Principles

1. **Small always-loaded context.** `CLAUDE.md` is loaded on every turn. It
   holds only the project pitch, the working rules, and pointers of the form
   "before you do X, read Y". Everything else lives in `docs/agents/`.
2. **Never edit a third-party skill.** Skills are copied as they are, or left
   out entirely. Customise them only through files they read
   (`docs/agents/*`). If a project rule seems to need a new skill, write it as
   a doc in `docs/agents/` and point to it from `CLAUDE.md`.
3. **Copy the skills, do not install them as a plugin.** Cloud sessions of
   Claude Code load only the skills that are in the repository.
4. **GitHub through the REST API only.** In cloud sessions the proxy rejects
   the GraphQL calls that `gh issue` and `gh pr` use. Use `gh api` for every
   GitHub operation.
5. **Decisions end up in `main`.** A decision or a research note that exists
   only in an issue or on an unmerged branch is invisible to the next session.
6. **The owner is the only gate.** The agent never merges a pull request.
   Automated checks (CI) do the code checking that the owner cannot do.
7. **The owner's to-do list is "assigned to me".** When the agent needs the
   owner (an answer, a click, an account), it assigns an issue to the owner.
   No label is needed for that.
8. **No documentation, no decision.** If the agent cannot read the
   documentation it needs, it tells the owner before it decides or writes
   code. It never fills the gap from memory without the owner's go-ahead.

## Step 0: collect the inputs

Ask these in one message, with your recommended answer for each. Do not go
on without answers.

| Input | Used in |
|---|---|
| Project name and a one-sentence pitch | `CLAUDE.md`, `README.md`, `GLOSSARY.md` |
| GitHub repo `<owner>/<repo>` (read it from `git remote -v` and confirm) | `docs/agents/issue-tracker.md` |
| Owner's GitHub login (read it from `gh api user --jq .login` and confirm) | `CLAUDE.md`, `docs/agents/decisions.md` |
| Is the repo public or private? Is the owner on a paid GitHub plan? | Step 9 (branch protection) |
| Do the "Owner defaults" still hold? (show them; recommended: yes) | `docs/agents/decisions.md` |
| What type of project is it, if already known: SaaS, website, mobile, other, or not sure yet | `CLAUDE.md` pitch; the stack is decided later |

## Step 1: target tree

```
/
├── CLAUDE.md
├── README.md
├── GLOSSARY.md                    (skeleton: title + pitch only)
├── .gitignore
├── .markdownlint.jsonc
├── .claude/
│   ├── settings.json
│   └── skills/
│       ├── NOTICE.md
│       ├── CHECKSUMS
│       ├── LICENSE-mattpocock-skills
│       └── <skill>/…              (exact copy of the source)
├── .github/
│   ├── pull_request_template.md
│   └── workflows/
│       └── checks.yml
├── docs/
│   ├── setup-guide.md             (a copy of this guide)
│   └── agents/
│       ├── issue-tracker.md
│       ├── triage-labels.md
│       ├── domain.md
│       ├── decisions.md
│       └── when-code-arrives.md
└── scripts/
    ├── labels.sh
    └── skills-checksums.sh
```

Copy this guide, unchanged, to `docs/setup-guide.md`. It is how the owner
starts the next project.

Do **not** create empty `docs/adr/` or `docs/research/` folders. The skills
create them when the first decision or note is ready.

## Step 2: copy the skills

1. Clone `https://github.com/mattpocock/skills` into a temporary directory
   outside the target repo. Write down the release tag and the commit SHA.
2. Read `.claude-plugin/plugin.json` in the source. It lists the skill
   folders. Copy those folders into `.claude/skills/`, **except** the six
   below. Do not change any copied file.

   | Left out | Why |
   |---|---|
   | `triage` | Sorts issues sent by other people. A solo owner receives none. |
   | `grill-me` | Duplicate of `grill-with-docs`, which also keeps a record in the repo. |
   | `improve-codebase-architecture` | Runs a technical architecture debate the owner cannot judge. |
   | `teach` | A learning tool, unrelated to building the project. |
   | `handoff` | Saves its file in the machine's temp directory, which a cloud session loses. |
   | `wizard` | Generates a script the owner must run in a terminal. Replaced by section 7 of `decisions.md`. |

   If the source has skills that are neither in this list nor in the README
   skills guide (Step 5), stop and ask the owner whether to keep them.
3. Copy the source licence to `.claude/skills/LICENSE-mattpocock-skills`.
4. Write `.claude/skills/NOTICE.md`:

   ```markdown
   # Matt Pocock's skills

   The folders in `.claude/skills/` are copied unchanged from
   [mattpocock/skills](https://github.com/mattpocock/skills), version <X.Y.Z>
   (commit `<sha>`), under the MIT licence (full text in
   `LICENSE-mattpocock-skills`).

   They are copied instead of installed as a plugin because Claude Code cloud
   sessions load only the skills that are in the repository.

   Left out on purpose: `triage`, `grill-me`, `improve-codebase-architecture`,
   `teach`, `handoff`, `wizard`. See `docs/setup-guide.md` for why.

   To update: copy again the folders listed in `.claude-plugin/plugin.json` of
   the source repo, except the ones left out above; update the version above;
   run `scripts/skills-checksums.sh`.
   ```

5. Write `scripts/skills-checksums.sh`, then run it:

   ```bash
   #!/usr/bin/env bash
   # Records a checksum of every copied skill file, so CI can detect an edit.
   set -euo pipefail
   cd "$(git rev-parse --show-toplevel)"
   find .claude/skills -type f ! -name CHECKSUMS ! -name NOTICE.md -print0 \
     | sort -z | xargs -0 sha256sum > .claude/skills/CHECKSUMS
   ```

## Step 3: `CLAUDE.md`

Use this template. Replace `<…>`. Keep it under 50 lines.

```markdown
# <Project>

<One-sentence pitch.>

## Working rules

- Write everything in English: files, issues, PRs, commits, answers.
- The owner, `<login>`, works alone and is not a developer. Speak in plain
  English. Explain any technical term the first time you use it.
- Before you ask the owner any question, or need the owner to do anything, in
  any skill, read `docs/agents/decisions.md`.
- If you cannot read the documentation you need, stop and tell the owner
  before you decide or write code: `docs/agents/decisions.md`, section 10.
- When the owner asks which command to run, or how to handle an idea or a
  ticket, answer from the "Skills guide" section of `README.md`. Skills not
  listed there are not installed, even if another skill mentions them.
- Never merge a pull request. The owner merges.
- All changes go through a branch and a pull request, squash-merged; the
  branch is deleted after the merge.
- When the first application code is added, follow
  `docs/agents/when-code-arrives.md` in the same pull request.

## Agent skills

### Issue tracker

Issues live in the GitHub Issues of `<owner>/<repo>`, driven by `gh api`
(the REST API, never `gh issue` or `gh pr`). See
`docs/agents/issue-tracker.md`.

### Triage labels

Only `ready-for-agent` is used. See `docs/agents/triage-labels.md`.

### Domain docs

Single context: one `GLOSSARY.md` and one `docs/adr/` at the root. See
`docs/agents/domain.md`.

### Research

A research note goes in `docs/research/<topic>.md` and reaches `main` through
a pull request when its ticket is closed.
```

Each pointer must say **when** to read its file, not only that it exists.

## Step 4: `docs/agents/`

Start from the templates in the cloned source at
`skills/setup-matt-pocock-skills/` (`issue-tracker-github.md`,
`triage-labels.md`, `domain.md`), then apply the changes below.

### 4.1 `issue-tracker.md`

- Open with the rule: everything goes through `gh api` REST, never
  `gh issue` or `gh pr`, and give the reason (cloud proxy rejects GraphQL with
  HTTP 403).
- Declare the repo once: "In this file, `<repo>` means `<owner>/<repo>`."
- Give one exact command for each operation:
  - create an issue, with the body in a temp file: `-F body=@body.md`;
  - read an issue and its comments;
  - list issues, removing PRs with `select(.pull_request | not)`;
  - comment; add and remove a label; assign;
  - close, with `state_reason` (`completed`, or `not_planned` for work that
    is dropped), after a closing comment;
  - add a sub-issue: `POST /issues/<parent>/sub_issues -F sub_issue_id=<id>`;
  - mark a blocker: `POST /issues/<blocked>/dependencies/blocked_by -F issue_id=<id>`;
  - open a PR: `POST /pulls` with `head`, `base=main` and a body file; read a
    PR and its diff (`-H 'Accept: application/vnd.github.diff'`).
- State that `<id>` is the numeric database id (`--jq .id`), not the
  `#number` and not the `node_id`.
- Add the flag: "PRs as a request surface: no."
- Add the sections "When a skill says publish to the issue tracker" (create a
  GitHub issue) and "When a skill says fetch the relevant ticket" (read the
  issue and its comments).
- Add a "Mapping operations" section for `/wayfinder`: the map is one issue
  with label `wayfinder:map` and a Notes / Decisions so far / Fog body;
  tickets are sub-issues with label `wayfinder:<type>`; blocking uses native
  issue dependencies; the frontier is the open sub-issues with no open
  blocker and no assignee, first in map order wins; claiming is assigning to
  yourself as the first write of the session; resolving is comment, close,
  then add a pointer (gist + link) to the map's Decisions so far.
- Add: "A PR that implements an issue has `Closes #<n>` in its body."

### 4.2 `triage-labels.md`

| Canonical role | Label in this repo | Meaning |
|---|---|---|
| `ready-for-agent` | `ready-for-agent` | Fully specified; the agent can build it alone |
| `needs-triage` | not used | No external issues in a solo repo |
| `needs-info` | not used | The issue is assigned to the owner instead |
| `ready-for-human` | not used | The issue is assigned to the owner instead |
| `wontfix` | not used | Close the issue as "not planned" instead |

Say that the right-hand column is the source of truth, and point to
`decisions.md` for how to ask the owner for something.

### 4.3 `domain.md`

- Read before exploring: `GLOSSARY.md`, then the ADRs of the area you are
  about to touch.
- If one of them is missing, go on without comment. Do not suggest creating
  it.
- Use the glossary terms. Never use the terms it lists under "Avoid".
- If your output contradicts an ADR, say so openly.

### 4.4 `decisions.md`

This file replaces a developer. Write it with these sections, in this order:

1. **Two kinds of decision.**
   - A **product decision** changes what a user sees, can do, or gets; or
     what the project costs; or what it promises. Ask it in the user's words.
   - A **technical decision** needs knowledge of how software is built:
     storage, architecture, libraries, hosting, performance, security.
2. **Before asking anything.** Read the code, the glossary and the ADRs of
   the area. A consequence you find in the code becomes a product question:
   "Deleting X also removes Y. Should we delete Y too, keep it, or block the
   deletion?"
3. **How to ask a technical decision.** Do not ask the owner to design.
   Present it as a choice the owner can judge:
   - what is being decided, in one plain sentence;
   - two or three options, each with: what the owner will notice, money cost
     (one-off and monthly), risk, and how hard it is to undo later;
   - your recommendation and why, first.
   The owner answers "ok" or picks another option.
4. **Small technical choices.** If a choice is cheap to undo and changes
   nothing the owner can notice (naming, file layout, a small library), make
   it yourself and mention it in one line in the PR. Do not ask.
5. **Recording.** A decision that is hard to undo, surprising, or the result
   of a real trade-off becomes an ADR in `docs/adr/`, through
   `/domain-modeling`. Write in the ADR that the owner approved it and on what
   date.
6. **Grouping.** In a grill, ask product questions first. Keep technical
   questions until the product questions they depend on are settled, then ask
   them together in one round.
7. **When the owner must answer later, or act.** If a question cannot be
   answered in the session, or a step needs the owner (create an account,
   pay, accept terms, get an API key):
   - write it in an issue, assigned to `<login>`;
   - for an action, give numbered click-by-click steps: the exact URL, what
     to click, what to copy, where to paste it;
   - never ask the owner to paste a secret (API key, password) in the chat or
     in an issue. Tell the owner where to store it: the Claude Code
     environment settings for the agent's sessions, or the repo's
     *Settings → Secrets and variables → Actions* for CI;
   - never ask the owner to run a terminal command;
   - give the owner the issue link, and mark every issue that waits on it as
     blocked by it.
   When the owner answers in the issue, the next session on it reads the
   answer, unassigns the owner, and closes or continues the issue.
8. **Owner constraints and stack profiles.** Copy the "Owner defaults"
   section of the setup guide here, as confirmed by the owner at setup.
   Apply the constraints to every technical decision, not only the stack.
9. **Choosing the tech stack.**
   - *When:* once the product's shape is known (who uses it, on what device,
     what data it keeps) and **before `/to-spec`**, so the spec and tickets
     are written for the chosen stack. In `/wayfinder`, create a ticket
     "Choose the tech stack", blocked by the product decision tickets it
     depends on. In `/grill-with-docs`, ask it at the end, after the product
     questions.
   - *How:* name the project type. If it has a profile, propose the profile
     and ask the owner to confirm it; if part of the profile fits this
     project badly, say which part and why, and present that part as a
     technical decision (section 3). If it has no profile, present two or
     three options using these criteria, in this order: meets the owner
     constraints; widely used, so you know it well; managed hosting with no
     server to maintain, and a preview link on every pull request; fewest
     services and accounts; free to start.
   - *Recording:* the result is `docs/adr/0001-tech-stack.md` (or the next
     free number): the stack, the exact versions, the EU region of each
     service that stores user data, the monthly cost at launch, and the
     owner's approval with its date.
   - *Accounts:* each account or project to create (for example a Supabase
     project in an EU region) is an issue assigned to the owner, with
     click-by-click steps (section 7).
10. **When you cannot read the documentation.** This applies when a docs
    page you need is blocked by the network, fails to load, or does not
    exist; or when a library's current version is newer than what you know
    and you cannot read its current docs.
    - Stop before you make the decision or write the code that depends on
      it. Other work that does not depend on it can go on.
    - Tell the owner, in plain English: which site or page, why you need it,
      and what you would otherwise have to guess.
    - If the network blocked it, propose adding the site to the cloud
      environment's allowed domains; the owner approves on a card. If you
      cannot propose it, give the owner the clicks: the environment name in
      the session's title bar → **Edit** → **Network access** → add the
      domain under **Allowed domains**, keeping **Allow package managers**
      ticked.
    - Do not decide or write code from memory in its place. If the owner
      explicitly says to go on without the docs, do so, and write in the PR
      (and the ADR, if there is one) which docs you could not read.

### 4.5 `when-code-arrives.md`

Instructions for the session that adds the first application code. The
session does all of this in the same pull request as that code:

0. If `docs/adr/` has no tech stack ADR, stop. Make the stack decision first
   (`decisions.md`, section 9), and write no application code until the
   owner has merged that ADR.
1. Read the current documentation of each part of the stack you are about to
   use. If you cannot, follow `decisions.md`, section 10.
2. Choose the test tool for the stack (a technical decision: follow
   `decisions.md`) and add at least one test.
3. Add a `test` job to `.github/workflows/checks.yml` that installs
   dependencies and runs the tests on every pull request. If `main` is
   protected, ask the owner to add `test` to the required checks, with the
   exact clicks.
4. Write `docs/agents/coding-standards.md`: the conventions `/code-review`
   enforces. Start short; `/retro` adds rules over time.
5. Add a pointer to it in `CLAUDE.md`: "Before writing or reviewing code, read
   `docs/agents/coding-standards.md`."
6. If the project has a visible interface, every PR that changes it shows
   before/after screenshots in its body (the `/pr` skill does this).
7. Hosting and releases are technical decisions: follow `decisions.md`, and
   prefer a setup where a merge to `main` publishes the new version and every
   PR gets a preview link the owner can open.
8. Tell the owner, in plain English, what changed in their routine (for
   example: "a red cross on a PR now means a test failed; do not merge").

## Step 5: `README.md`

Written for the owner, in plain English. Copy the template below and replace
`<…>`. Do not shorten it: it is the owner's manual.

~~~markdown
# <Project>

<One-sentence pitch.>

## How this repo works

I decide; Claude proposes, writes and builds. Ideas, decisions and tasks are
GitHub Issues. The words we agree on are in `GLOSSARY.md`, the big decisions
in `docs/adr/`. Nothing reaches `main` until I merge a pull request.

## Day to day

- **Start a session:** Claude Desktop → **Code** tab → **Cloud** → pick this
  repo → type a command from the guide below.
- **Answer questions:** Claude asks in rounds, each question numbered with a
  recommended answer. Reply "ok", or give the numbers you want to change.
  If something is unclear, type `/wait-what`.
- **My to-do list:** <https://github.com/issues/assigned>. When Claude needs
  me to answer or do something, it assigns me an issue with the steps.
- **Never paste a password or API key** in the chat or in an issue. Claude
  tells me where to store it.
- **If Claude says it cannot read some documentation**, it stops and asks me
  first. Usually it proposes to allow the website: I approve the card, and
  it goes on. I only tell it to go on without the docs if I accept the risk.
- **Merge a pull request:** open the PR link Claude gives me. Check that all
  checks are green (✅). Read the summary at the top and look at the
  screenshots. If it matches what I asked, click **Squash and merge**, then
  **Delete branch**. If a check is red (❌), do not merge: ask Claude to fix
  it.
- Sessions can stay open and be resumed later. Several can run at the same
  time, one per ticket.

## Skills guide

### Which command to run

| My situation | Command |
| --- | --- |
| Big and foggy, I can't see the way yet | `/wayfinder` |
| A clear enough idea | `/grill-with-docs`, then `/to-spec` and/or `/to-tickets` in the same session |
| I need to see it before I decide | `/prototype` |
| A question that needs reading | `/research` |
| I need answers from someone else | `/to-questionnaire` |
| A ticket labelled `ready-for-agent` | `/implement` + ticket link |
| A whole spec to build | `/implement-spec` + spec link |
| A big PR I want checked again before merging | `/code-review` + PR link |
| Something is broken | `/diagnosing-bugs` |
| A build went badly | `/retro`, in the same session |
| I didn't understand Claude's last message | `/wait-what` |
| I don't know | `/ask-matt`, or just ask "which command should I run?" |

### Each skill in detail

**`/grill-with-docs`**: my main entry point.
- *When:* I have an idea, a feature, a change, or an issue assigned to me
  with questions.
- *How:* type it, then describe the idea in a few sentences (or paste the
  issue link). Answer each round. It ends when Claude has no more questions.
- *I get:* a shared understanding, new words in `GLOSSARY.md`, big decisions
  in `docs/adr/`, in a pull request to merge.
- *Then:* in the **same session**, run `/to-spec` (big work) and/or
  `/to-tickets`. For something tiny, ask Claude to build it right away.

**`/wayfinder`**: for the project that is too big or too foggy.
- *When:* a whole new product, or a large feature where I don't know where
  to start. Not for a well-defined feature: use `/grill-with-docs`.
- *How:* first time, `/wayfinder` + a description. Claude creates a "map"
  issue with decision tickets. After that, `/wayfinder` + the map link works
  the next open ticket. One ticket per session.
- *I get:* decisions, one by one, recorded on the map. No code.
- *Then:* when the map is clear, `/to-spec` to turn it into a build plan.

**`/to-spec`**
- *When:* right after a grill or a cleared map, for work that spans many
  tickets.
- *How:* type it in the same session. No questions: Claude summarises what
  was said.
- *I get:* a spec issue on GitHub that keeps the big picture.
- *Then:* `/to-tickets`.

**`/to-tickets`**
- *When:* right after a grill or `/to-spec`.
- *How:* type it in the same session. Claude proposes a list of tickets and
  their order; say "ok" or adjust.
- *I get:* GitHub issues labelled `ready-for-agent`, linked by what blocks
  what.
- *Then:* `/implement` each ticket, or `/implement-spec` for all.

**`/implement`**
- *When:* a `ready-for-agent` ticket whose blockers are closed.
- *How:* new session, `/implement` + ticket link. One ticket per session.
- *I get:* a pull request with tests, a summary and screenshots.
- *Then:* check and merge it (see "Day to day").

**`/implement-spec`**
- *When:* I want a whole spec built in one go, not ticket by ticket.
- *How:* new session, `/implement-spec` + spec link. It can take a while.
- *I get:* one pull request with all the tickets of the spec.

**`/prototype`**
- *When:* I can't decide on paper: how a screen should look, or whether a
  set of rules behaves as I expect.
- *How:* type it + the question. Claude builds a throwaway version I can try.
- *I get:* an answer to one question. The prototype is kept on its own
  branch for reference; it is not the real product.

**`/research`**
- *When:* a question needs reading: competitors, a tool's documentation, an
  API, a regulation.
- *How:* type it + the question. It runs in the background; I can keep
  working.
- *I get:* a note with sources in `docs/research/`.
- *Then:* bring it into `/grill-with-docs`.

**`/to-questionnaire`**
- *When:* the answer is in someone else's head: a customer, an expert, a
  partner.
- *How:* type it. Claude asks who it's for and what I need back.
- *I get:* a questionnaire to send or to go through in a meeting.
- *Then:* bring the answers into `/grill-with-docs`.

**`/code-review`**: optional.
- *When:* before merging a big or sensitive pull request, as a second
  opinion. Claude already reviews its own work.
- *How:* new session, `/code-review` + PR link.
- *I get:* a report on whether the code follows the project's rules and does
  what the ticket asked.

**`/diagnosing-bugs`**
- *When:* something is broken, wrong or slow.
- *How:* type it, then say what I did, what I expected, and what happened.
  Screenshots help.
- *I get:* a fix in a pull request, with a test that stops the bug coming
  back.
- *Then:* `/retro` in the same session.

**`/retro`**
- *When:* at the end of a session that went badly, or after a bug fix.
- *How:* type it in **that same session**, before closing it.
- *I get:* suggestions to change Claude's rules so it doesn't happen again.
  Say "ok" to the ones I agree with.

**`/wait-what`**
- *When:* any time Claude's last message lost me.
- *I get:* the same message, re-explained simply, with the project's words.

**`/ask-matt`**
- *When:* I don't know which command fits.
- *Note:* it may mention `/triage`, `/grill-me`, `/teach`, `/handoff`,
  `/wizard` or `/improve-codebase-architecture`. They are not installed here
  on purpose; use the table above instead.

### Skills Claude uses on its own

I never type these. They run inside the commands above.

| Skill | What it does for me |
| --- | --- |
| `grilling`, `domain-modeling` | Run the questions of `/grill-with-docs` and keep the glossary and decisions |
| `tdd` | Writes tests before the code, so the code is checked without me reading it |
| `codebase-design` | Keeps the code well organised for future sessions |
| `pr` | Writes pull requests I can read: summary, before/after screenshots |
| `code-review` | Reviews its own work before opening a pull request |
| `writing-for-agents` | Keeps Claude's instruction files clear |
| `setup-matt-pocock-skills` | Used once, at setup |

## Start a new project

Each project gets its own repo. The setup guide that builds it is in
`docs/setup-guide.md` of every project. Always use the one from my **most
recent** project: it has my latest defaults.

1. **Get the guide.** On GitHub, open my most recent project → `docs` →
   `setup-guide.md` → click **Download raw file** (the download icon at the
   top right of the file).
2. **Create the repo.** On GitHub, click **+** (top right) → **New
   repository**.
   - Name: the project name, in lowercase with dashes (`my-new-app`).
   - **Private** (or Public if I want it open; only public repos get free
     protection of `main`).
   - Tick **Add a README file**, so the repo is not empty.
   - Click **Create repository**.
3. **Give Claude access to it**, if my Claude GitHub app only sees selected
   repos: GitHub → my picture → **Settings** → **Applications** → **Claude**
   → **Configure** → under **Repository access**, add the new repo → **Save**.
4. **Open a session.** Claude Desktop → **Code** tab → **Cloud** → pick the
   new repo. If it is not in the list, check step 3.
5. **Start the setup.** Attach `setup-guide.md` and type: "Set up this repo
   following this guide."
6. **Answer the setup questions.** Claude shows my defaults (budget, data in
   the EU, my stack profiles) and asks if they still hold. It asks a few
   things about the project.
7. **Merge the setup pull request** when its checks are green, and do the
   clicks Claude gives me (labels, protection of `main`).
8. **Start the project:** open the first issue assigned to me, "First grill:
   describe the project", and follow it.

If my defaults change (new account, bigger budget, a new stack profile), I
ask Claude to update `docs/setup-guide.md` in my most recent project, so the
next one starts from it.
~~~

## Step 6: `GLOSSARY.md`

Create only the title and the pitch. Do not write any term yourself: the
glossary grows through `/grill-with-docs` and `/domain-modeling`. Expected
format (see `.claude/skills/domain-modeling/GLOSSARY-FORMAT.md`):

```markdown
**Term**:
Definition in one to three sentences.
_Avoid_: synonym1, synonym2
```

## Step 7: repo tooling

1. **`scripts/labels.sh`**: idempotent; creates through
   `gh api repos/<repo>/labels` these six labels, each with a one-line
   description: `ready-for-agent`, `wayfinder:map`, `wayfinder:research`,
   `wayfinder:prototype`, `wayfinder:grilling`, `wayfinder:task`. Ignore
   HTTP 422 (label already exists). Do not delete GitHub's default labels.
2. **`.claude/settings.json`**: pre-allow read-only and routine commands so
   the owner sees fewer permission prompts:

   ```json
   {
     "permissions": {
       "allow": [
         "Bash(gh api:*)",
         "Bash(git status:*)",
         "Bash(git log:*)",
         "Bash(git diff:*)",
         "Bash(git fetch:*)",
         "Bash(git branch:*)"
       ]
     }
   }
   ```

3. **`.github/pull_request_template.md`**: use the section headings of the
   `/pr` skill, plus a first line "Closes #".
4. **`.gitignore`**: `.scratch/`, `.env`, `.DS_Store`.
5. **`.markdownlint.jsonc`**: default rules, with `MD013` (line length) off.

## Step 8: CI (`.github/workflows/checks.yml`)

One workflow, triggered on `pull_request` to `main`, with three jobs. Pin
each action to a release tag you have checked exists.

- **markdown**: `DavidAnson/markdownlint-cli2-action` on `**/*.md`, excluding
  `.claude/skills/**` and `docs/setup-guide.md`. Checks the form of the
  Markdown files.
- **links**: `lycheeverse/lychee-action` with `--offline` on `**/*.md`,
  excluding `.claude/skills/**` and `docs/setup-guide.md`. Catches pointers
  in `CLAUDE.md` and the docs that point to a missing file.
- **skills**: `sha256sum -c .claude/skills/CHECKSUMS`. Fails if a copied
  skill was edited.

The `test` job is added later by `when-code-arrives.md`.

Run the three checks locally before you commit, and fix what fails.

## Step 9: go live

These actions touch GitHub or the owner's settings. Ask the owner before
each one.

1. Commit everything on a branch, open a PR to `main`, and give the owner the
   link. Wait until CI is green. The owner merges.
2. Run `scripts/labels.sh`.
3. Protect `main`. Branch protection is free for **public** repos and needs a
   paid plan (GitHub Pro) for **private** repos.
   - If it is available: give the owner the exact clicks in
     *Settings → Rules → Rulesets*: target `main`, require a pull request,
     require the status checks `markdown`, `links` and `skills`, block force
     pushes. In *Settings → General*, allow only squash merging and turn on
     "Automatically delete head branches".
   - If it is not: still give the clicks for the merge options in
     *Settings → General*, and tell the owner that the "everything through a
     PR" rule is enforced only by `CLAUDE.md`.
4. Check that the Claude Code cloud environment allows the docs sites of the
   project's stack profile (or of all profiles, if the type is not known
   yet). If one is blocked, propose adding it to the environment's allowed
   domains; the owner approves on a card. As of November 2026 the owner's
   Default environment allows: `tanstack.com`, `react.dev`, `vite.dev`,
   `www.typescriptlang.org`, `tailwindcss.com`, `ui.shadcn.com`,
   `supabase.com`, `developers.cloudflare.com`, `docs.astro.build`,
   `www.sanity.io`, `docs.expo.dev`, `reactnative.dev`.
5. Open a first issue, assigned to the owner, "First grill: describe the
   project", that tells the owner to start a session with
   `/grill-with-docs` + the issue link.

## Final check

- [ ] `CLAUDE.md` is under 50 lines and every file it names exists.
- [ ] `.claude/skills/` holds every skill folder of the source except the six
      left out, and none of those six.
- [ ] `sha256sum -c .claude/skills/CHECKSUMS` passes.
- [ ] `docs/setup-guide.md` is an unchanged copy of this guide.
- [ ] No `gh issue` or `gh pr` command in `docs/agents/`.
- [ ] `docs/agents/decisions.md` has all ten sections, with the owner
      constraints and stack profiles as confirmed at Step 0.
- [ ] The six labels exist on GitHub.
- [ ] Every skill in the README skills guide is installed, and every
      installed skill appears in it.
- [ ] Every file the agent wrote is in English.
- [ ] The README asks the owner for no terminal command.
- [ ] CI is green on the setup PR.

## Do not

- Create a custom skill for a working rule. A doc in `docs/agents/` is
  enough and survives skill updates.
- Fill the glossary or write ADRs in advance.
- Decide or write code from memory when the documentation is out of reach,
  unless the owner says to go on.
- Ask the owner to read code, run a terminal command, paste a secret, or
  choose between options with no stated consequences.
- Merge a pull request, or push to `main` directly.
- Leave a decision or a research note only in an issue or on a branch.