# CI/CD — Database (provisioning, data source, migration execution model)

> **Status: partly built.** Provisioning and the data source exist (`T-C10-16`): the compose stacks
> under `docker/`, `apps/api/src/data-source.ts`, the environment validation and the four
> `migration:*` scripts. **No migration exists yet** — the first one, and the migration convention,
> belong to **`T-C10-17`**. Verify the current state in the code before trusting any detail below.

## Provisioning — `T-C10-16` (built)

A local **PostgreSQL 18** — image `postgres:18.6`, pinned to the exact patch tag, never `postgres:18`
or `latest` (`CLAUDE.md` §2). 18 is a hard functional floor, not only a version policy: the schema's
primary-key safety-net default is the core `uuidv7()` function, which does not exist before 18
(`DATA-MODEL.md` §3.1.1, ADR-012).

| Stack | File | Host port | Database | Storage |
|---|---|---|---|---|
| Development | `docker/docker-compose.dev.yml` (service `postgres`) | `5432` | `sport_itsm_dev` | named volume `postgres-data`, mounted at **`/var/lib/postgresql`** |
| Acceptance | `docker/docker-compose.e2e.yml` (service `postgres-e2e`) | `5499` | `sport_itsm_e2e` | none — ephemeral, destroyed on `down` |
| Stage | — | — | — | managed by the hosting platform; `docker-compose.stage.yml` has no `postgres` service |

Each compose file declares an explicit `name:` — all three live in `docker/`, and without it they
would share one Compose project, so tearing one stack down would take another's volume with it.

The volume mount point is PostgreSQL-18-specific — see `gotchas.md`, *PostgreSQL 18 images reject a
volume mounted at `/var/lib/postgresql/data`*.

The API reads the connection from five mandatory keys with no in-code default — `POSTGRES_HOST`,
`POSTGRES_PORT`, `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` — validated at boot by
`apps/api/src/config/env.validation.ts` and listed in `.env.example`. The credentials in the compose
files are development-only literals; real credentials are never committed.
`pnpm typeorm migration:show -d apps/api/src/data-source.ts` against the development stack must
connect and list the applied migrations (empty until `T-C10-17`).

Waiting for it to be ready means `pg_isready` (the compose healthcheck), not a sleep.

## The migration execution model — the rule that matters most

From `CLAUDE.md` §3 and `ARCHITECTURE.md` §6.3, and non-negotiable:

- **`synchronize` is `false` in every environment.** No code path sets it to `true`, ever. Schema
  changes happen through migrations and nothing else.
- **`migrationsRun` is `false`.** Auto-run is gated to development and is never unconditional in
  staging or production, where migrations run as a **controlled, separate deploy step** before the
  new application version starts serving.
- The data source resolves every connection value through `ConfigService`. Grepping
  `data-source.ts` for `process.env` must return nothing outside the configuration module it
  delegates to.

The four scripts `T-C10-16` delivers: `migration:generate`, `migration:run`, `migration:revert`,
`migration:show` — all with `-d apps/api/src/data-source.ts`.

## Ephemeral database for acceptance runs

Once `apps/api-e2e` exists (`T-C10-06`) and the API talks to a database, acceptance runs need their
own instance. The shape that works:

1. Start a disposable PostgreSQL 18 (a service container, or the same compose file with a distinct
   volume and port).
2. Wait with `pg_isready`, not a fixed sleep.
3. Run the migration chain against it — the same chain production uses, never `synchronize`.
4. Run the suite.
5. Discard the volume.

Never point an acceptance run at a shared or long-lived database. The suites assert on state, and a
suite that depends on leftover rows is a suite that passes for the wrong reason.

## Backups and resets

No backup script exists and no environment needs one yet — there is no data anywhere. When a
long-lived environment appears, the operations are `pg_dump` for capture and `pg_restore` for
recovery, and a reset means **drop, recreate, re-run the migration chain** — never a manual `ALTER`
that leaves the schema in a state no migration can reproduce.

`FR-AUD-03` says no role, including System Administrator, may edit or delete history. That shapes
database operations too: a "fix" applied directly to the audit tables is a defect, not a repair.

## Rules

- **The migration chain is the schema.** If a database cannot be rebuilt from an empty state by
  running the chain, the chain is broken — fix it, do not patch the database.
- **Every schema change ships as a migration**, generated against the entity model, reviewed like
  code.
- **Credentials come from the environment.** `.env` is gitignored; `.env.example` lists the keys.
- **One database, schema per bounded context.** Cross-context references are indexed `uuid` columns
  with no foreign key (ADR-003) — the database expression of the module-boundary rule. Do not "fix"
  a missing FK by adding one.
