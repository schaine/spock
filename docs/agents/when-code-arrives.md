# When the first application code arrives

Instructions for the session that adds the first application code. Do all of
this in the same pull request as that code.

0. If `docs/adr/` has no tech stack ADR, stop. Make the stack decision first
   (`docs/agents/decisions.md`, section 9), and write no application code
   until the owner has merged that ADR.
1. Read the current documentation of each part of the stack you are about to
   use. If you cannot, follow `docs/agents/decisions.md`, section 10.
2. Choose the test tool for the stack (a technical decision: follow
   `docs/agents/decisions.md`) and add at least one test.
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
7. Hosting and releases are technical decisions: follow
   `docs/agents/decisions.md`, and prefer a setup where a merge to `main`
   publishes the new version and every PR gets a preview link the owner can
   open.
8. Tell the owner, in plain English, what changed in their routine (for
   example: "a red cross on a PR now means a test failed; do not merge").
