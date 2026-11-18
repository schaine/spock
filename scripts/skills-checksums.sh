#!/usr/bin/env bash
# Records a checksum of every copied skill file, so CI can detect an edit.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
find .claude/skills -type f ! -name CHECKSUMS ! -name NOTICE.md -print0 \
  | sort -z | xargs -0 sha256sum > .claude/skills/CHECKSUMS
