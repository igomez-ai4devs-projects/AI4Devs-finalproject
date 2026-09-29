---
name: feedback-typeorm-cli-env-shadowing
description: Machine-wide POSTGRES_* vars from another project shadow the repo .env for the TypeORM CLI — pass the dev values inline on every command (dev DB is on host port 5452).
metadata:
  type: feedback
---

This Windows machine has machine-wide `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`,
`POSTGRES_PASSWORD` and `POSTGRES_DB` from another project (`recipes_social_network_database_dev`,
user `userdev`). Node's `--env-file-if-exists=.env` (used by the `pnpm typeorm` script) never
overrides variables that are already set, so those win over `.env` silently — without overrides the
CLI fails with `password authentication failed for user "userdev"`.

The Sport ITSM dev container `sport-itsm-postgres-dev` publishes **host port 5452** (container 5432),
because host 5432 is taken by another local PostgreSQL on the maintainer's machine. `.env` and
`.env.example` say 5452 too.

**Why:** the CLI connected to the wrong database/credentials while verifying T-C10-17 (2026-09-25).

**How to apply:** prefix every TypeORM CLI command against the dev DB, in the same Bash call:

```
POSTGRES_HOST=localhost POSTGRES_PORT=5452 POSTGRES_DB=sport_itsm_dev POSTGRES_USER=postgres POSTGRES_PASSWORD=postgres pnpm migration:show
```

Do not add `-d` to the short `migration:*` scripts (they already carry it). Do not edit `.env` or the
machine environment. `apps/api-e2e` is unaffected: its targets pass their own values (port 5499).
