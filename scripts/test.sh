#!/usr/bin/env bash
# Runs the tests against the local test database (started with
# `supabase start`). Usage: scripts/test.sh [deno test arguments]
set -euo pipefail
cd "$(dirname "$0")/.."

eval "$(supabase status -o env 2>/dev/null | sed -n -E 's/^(API_URL|PUBLISHABLE_KEY|SECRET_KEY|DB_URL)=/LOCAL_\1=/p')"
export SUPABASE_URL="$LOCAL_API_URL"
export SUPABASE_PUBLISHABLE_KEY="$LOCAL_PUBLISHABLE_KEY"
export SUPABASE_SECRET_KEY="$LOCAL_SECRET_KEY"
export SUPABASE_DB_URL="$LOCAL_DB_URL"

if [ "$#" -eq 0 ]; then set -- supabase/functions/tests/; fi
exec deno test --allow-env --allow-net --allow-read "$@"
