#!/usr/bin/env bash
# Runs one publish check (scripts/publish_checks/*.sql) on the Spock project,
# after `supabase link`. Used by .github/workflows/publish.yml.
# Usage: scripts/publish-check.sh <file.sql>
set -euo pipefail
cd "$(dirname "$0")/.."

# GitHub's machines have no IPv6, so they reach the database through
# Supabase's connection pooler, whose address `supabase link` saves here.
pooler_url_file=supabase/.temp/pooler-url
if [ ! -s "$pooler_url_file" ]; then
  echo "::error::supabase link saved no connection pooler address. The SUPABASE_ACCESS_TOKEN secret needs the Connection Pooling: Read permission (issue #41)."
  exit 1
fi

PGPASSWORD="$SUPABASE_DB_PASSWORD" psql "$(cat "$pooler_url_file")" \
  --no-psqlrc --quiet -v ON_ERROR_STOP=1 -f "$1"
