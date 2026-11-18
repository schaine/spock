# Spock

Spock is a macroeconomic intelligence platform that monitors key economic indicators across the US, France and the EU to identify early signs of AI-driven economic disruption, helping users anticipate risks and prepare for a new economic era.

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
