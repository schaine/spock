#!/usr/bin/env bash
# Creates the labels this repo uses. Safe to run more than once:
# a label that already exists (HTTP 422) is skipped. GitHub's default
# labels are left untouched.
set -euo pipefail

REPO="schaine/spock"

create_label() {
  local name="$1" color="$2" description="$3" out
  if out=$(gh api "repos/$REPO/labels" -X POST \
      -f name="$name" -f color="$color" -f description="$description" 2>&1); then
    echo "created: $name"
  elif grep -q "HTTP 422" <<<"$out"; then
    echo "exists:  $name"
  else
    echo "failed:  $name" >&2
    echo "$out" >&2
    return 1
  fi
}

create_label "ready-for-agent"     "0e8a16" "Fully specified; the agent can build it alone"
create_label "wayfinder:map"       "5319e7" "Wayfinder map: the plan of a big or foggy piece of work"
create_label "wayfinder:research"  "1d76db" "Wayfinder ticket: a question that needs reading"
create_label "wayfinder:prototype" "fbca04" "Wayfinder ticket: a question answered by a throwaway prototype"
create_label "wayfinder:grilling"  "d93f0b" "Wayfinder ticket: a decision made by questioning the owner"
create_label "wayfinder:task"      "c5def5" "Wayfinder ticket: a concrete piece of work"
