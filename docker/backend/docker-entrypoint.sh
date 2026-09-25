#!/bin/sh
set -e

echo "=========================================="
echo "Starting Sport ITSM API"
echo "=========================================="

# Migration execution as a controlled, separate deploy step — never bundled
# into the process boot, never unconditional in staging or production
# (CLAUDE.md §3, ADR-013). On Render this step is the service's pre-deploy
# command, which runs before the new version starts serving, at this same
# image's WORKDIR (/app/dist/apps/api — the COPY in docker/backend/Dockerfile
# preserves this path inside the image rather than flattening it at the image
# root; see that file's WORKDIR comment for why the nesting is load-bearing,
# not cosmetic) — not this entrypoint. This script stays migration-free by
# design, in every environment, and only hands off to the container's CMD.
#
# The pre-deploy command (T-C10-69, `apps/api:build-migrations` compiles
# data-source.js + migrations/*.js directly into `dist/apps/api` — no
# ts-node, no TS_NODE_PROJECT, paste verbatim into Render's pre-deploy
# field):
#
#   node_modules/.bin/typeorm migration:run -d data-source.js
#
# (Relative to this WORKDIR, so it resolves to the same
# `data-source.js` file the root `pnpm migration:run:deploy` script targets
# via `dist/apps/api/data-source.js` from the repository root — same file,
# two equally valid relative paths for two different working directories.)

exec "$@"
