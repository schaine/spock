# Matt Pocock's skills

The folders in `.claude/skills/` are copied unchanged from
[mattpocock/skills](https://github.com/mattpocock/skills), version 1.3.2
(commit `5863806dd4e15c63174bee4e7515a4256792ecfa`), under the MIT licence
(full text in `LICENSE-mattpocock-skills`).

They are copied instead of installed as a plugin because Claude Code cloud
sessions load only the skills that are in the repository.

Left out on purpose: `triage`, `grill-me`, `improve-codebase-architecture`,
`teach`, `handoff`, `wizard`. See `docs/setup-guide.md` for why.

To update: copy again the folders listed in `.claude-plugin/plugin.json` of
the source repo, except the ones left out above; update the version above;
run `scripts/skills-checksums.sh`.
