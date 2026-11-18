# Domain docs

How the skills use this repo's domain documentation. This repo has a single
context: one `GLOSSARY.md` and one `docs/adr/` at the root.

## Before exploring, read these

1. `GLOSSARY.md` at the repo root.
2. The ADRs (decision records) in `docs/adr/` that touch the area you are
   about to work in.

If one of them is missing, go on without comment. Do not suggest creating it.
`/domain-modeling` creates them when a term or a decision is actually settled.

## Use the glossary's words

When your output names a domain concept (in an issue title, a proposal, a
test name, a message to the owner), use the term as `GLOSSARY.md` defines it.
Never use the terms it lists under "Avoid".

## Flag ADR conflicts

If your output contradicts an ADR, say so openly instead of silently
overriding it:

> _Contradicts ADR-0003 (data sources), but worth reopening because…_
