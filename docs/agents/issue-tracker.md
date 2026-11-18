# Issue tracker: GitHub

**Rule: every GitHub operation goes through `gh api` (the REST API). Never use
`gh issue` or `gh pr`.** They use GitHub's GraphQL API, and the proxy of
Claude Code cloud sessions rejects GraphQL calls with HTTP 403.

In this file, `<repo>` means `schaine/spock`.

Issues and specs for this repo live as GitHub issues.

## Ids

Some endpoints need an issue's `<id>`: its numeric **database id**, read with
`gh api repos/<repo>/issues/<n> --jq .id`. It is not the `#number` and not the
`node_id`.

## Conventions

- **Create an issue**: write the body to a temp file first, then:

  ```bash
  gh api repos/<repo>/issues -X POST -f title="..." -F body=@body.md
  ```

  Add `-f 'labels[]=ready-for-agent'` for a label and
  `-f 'assignees[]=schaine'` to assign the owner.
- **Read an issue and its comments**:

  ```bash
  gh api repos/<repo>/issues/<n> --jq '{number, title, state, body, labels: [.labels[].name], assignees: [.assignees[].login]}'
  gh api repos/<repo>/issues/<n>/comments --paginate --jq '.[] | {user: .user.login, created_at, body}'
  ```

- **List issues** (the endpoint also returns PRs; remove them):

  ```bash
  gh api 'repos/<repo>/issues?state=open&per_page=100' --paginate \
    --jq '.[] | select(.pull_request | not) | {number, title, labels: [.labels[].name], assignees: [.assignees[].login]}'
  ```

  Filter with `&labels=<label>`, `&assignee=<login>` or `&state=closed|all`.
- **Comment**: `gh api repos/<repo>/issues/<n>/comments -X POST -F body=@comment.md`
- **Add a label**: `gh api repos/<repo>/issues/<n>/labels -X POST -f 'labels[]=<label>'`
- **Remove a label**: `gh api repos/<repo>/issues/<n>/labels/<label> -X DELETE`
- **Assign**: `gh api repos/<repo>/issues/<n>/assignees -X POST -f 'assignees[]=<login>'`
- **Unassign**: `gh api repos/<repo>/issues/<n>/assignees -X DELETE -f 'assignees[]=<login>'`
- **Close**: first post a closing comment (see **Comment**), then:

  ```bash
  gh api repos/<repo>/issues/<n> -X PATCH -f state=closed -f state_reason=completed
  ```

  Use `state_reason=not_planned` for work that is dropped.
- **Add a sub-issue** (`<id>` is the child's database id):

  ```bash
  gh api repos/<repo>/issues/<parent>/sub_issues -X POST -F sub_issue_id=<id>
  ```

- **Mark a blocker** (`<id>` is the blocker's database id):

  ```bash
  gh api repos/<repo>/issues/<blocked>/dependencies/blocked_by -X POST -F issue_id=<id>
  ```

- **Count open blockers** (0 means the issue can start):
  `gh api repos/<repo>/issues/<n> --jq .issue_dependencies_summary.blocked_by`
- **Open a PR**: write the body to a temp file first, then:

  ```bash
  gh api repos/<repo>/pulls -X POST -f title="..." -f head=<branch> -f base=main -F body=@pr.md
  ```

  A PR that implements an issue has `Closes #<n>` in its body.
- **Read a PR and its diff**:

  ```bash
  gh api repos/<repo>/pulls/<n> --jq '{number, title, state, merged, body, head: .head.ref}'
  gh api repos/<repo>/pulls/<n> -H 'Accept: application/vnd.github.diff'
  ```

File issues only into `schaine/spock`. Never file into `mattpocock/skills`
(the repo the skills come from).

## Pull requests as a triage surface

**PRs as a request surface: no.** This is a solo repo; nobody else sends PRs.

## When a skill says "publish to the issue tracker"

Create a GitHub issue (see **Create an issue**).

## When a skill says "fetch the relevant ticket"

Read the issue and its comments (see **Read an issue and its comments**).

## Mapping operations

Used by `/wayfinder`.

- **Map**: one issue with the label `wayfinder:map`. Its body has three
  sections: Notes / Decisions so far / Fog.
- **Tickets**: sub-issues of the map (see **Add a sub-issue**), each labelled
  `wayfinder:<type>`, where the type is `research`, `prototype`, `grilling` or
  `task`.
- **Blocking**: native issue dependencies (see **Mark a blocker**).
- **Frontier**: the open sub-issues of the map that have no open blocker and
  no assignee. The first in map order wins. List the sub-issues with
  `gh api repos/<repo>/issues/<map>/sub_issues --paginate --jq '.[] | select(.state == "open") | {number, title, assignees: [.assignees[].login]}'`,
  then check each one's open blockers.
- **Claim**: assign the ticket to yourself (see **Assign**). This is the first
  write of the session.
- **Resolve**: comment the answer on the ticket, close it, then add a pointer
  (the gist in one line + a link to the ticket) to the map's Decisions so far,
  by editing the map body:
  `gh api repos/<repo>/issues/<map> -X PATCH -F body=@map.md`.
