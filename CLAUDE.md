# Spock

Spock is a macroeconomic intelligence platform that monitors key economic indicators across the US, France and the EU to identify early signs of AI-driven economic disruption, helping users anticipate risks and prepare for a new economic era.

## Working rules

- Write everything in English: files, issues, PRs, commits, answers.
- The owner, `schaine`, works alone and is not a developer. Speak in plain
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

Issues live in the GitHub Issues of `schaine/spock`, driven by `gh api`
(the REST API, never `gh issue` or `gh pr`). Before you create, read or
change an issue or a pull request, read `docs/agents/issue-tracker.md`.

### Triage labels

Only `ready-for-agent` is used. Before you apply or look for a label, read
`docs/agents/triage-labels.md`.

### Domain docs

Single context: one `GLOSSARY.md` and one `docs/adr/` at the root. Before
you explore the code or the docs for a task, read `docs/agents/domain.md`.

### Research

A research note goes in `docs/research/<topic>.md` and reaches `main` through
a pull request when its ticket is closed.
