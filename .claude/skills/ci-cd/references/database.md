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
| Development | `docker/docker-compose.dev.yml` (service `postgres`) | `5452` (container `5432`; host 5432 is taken locally) | `sport_itsm_dev` | named volume `postgres-data`, mounted at **`/var/lib/postgresql`** |
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

### Running migrations inside the deployed image — `T-C10-69` (built)

The four scripts above run `data-source.ts` as `.ts` through `ts-node` (`tools/typeorm.cjs`) — fine
locally, but the production image (`docker/backend/Dockerfile`) ships no `ts-node`/`typescript`
(`pnpm install --prod` against webpack's generated `package.json` excludes every root
`devDependency`). ADR-013 puts `typeorm migration:run` on Render's pre-deploy command, which runs
**inside that image**, so it needs a plain-CommonJS, non-bundled target.

- `apps/api:build-migrations` (`dependsOn: ["build"]`) compiles `data-source.ts` + `migrations/*.ts`
  with a dedicated `tsc -p apps/api/tsconfig.migrations.json` (via `tools/build-api-runtime.mjs`),
  emitting straight into `dist/apps/api` — the same directory `main.js` lands in, so the existing
  `COPY dist/apps/api …` in the Dockerfile already carries the compiled artifact into the image; no
  second `COPY`.
- The root script for the compiled artifact, run from the repository root (local sanity-check, not
  inside the image): `pnpm migration:run:deploy` → `typeorm migration:run -d
  dist/apps/api/data-source.js`. No `ts-node`, no `TS_NODE_PROJECT`.
- The verbatim command for Render's pre-deploy field (runs at the image's own WORKDIR, documented in
  `docker/backend/docker-entrypoint.sh`): `node_modules/.bin/typeorm migration:run -d
  data-source.js`. Same file as above — the path differs only because the two invocations start
  from different working directories (repository root vs. the image's WORKDIR).

Two packaging traps this target exists to close, both confirmed empirically while building `T-C10-69`
— see `gotchas.md` for the full writeups:

- **`pg` never appears in the webpack-generated `dist/apps/api/package.json`.** Nx's
  `generatePackageJson` infers runtime dependencies from this project's *static* import graph;
  nothing in this codebase statically imports `pg` (TypeORM's `PostgresDriver` `require()`s it
  lazily, only once a connection actually opens), so Nx omits it even though it is an (optional)
  peerDependency of `typeorm` and is pinned in the root `package.json`. `build-api-runtime.mjs`
  patches it in after compiling. **This will resurface for the running API itself** the first time a
  context wires `TypeOrmModule` into `app.module.ts` — reported, not fixed generally, since that is a
  different artifact than the one `T-C10-69` owns.
- **The Docker image must preserve the `dist/apps/api` path, not flatten it at the image root.**
  `data-source.ts`'s `entities` glob is `join(__dirname, '..', '**', '*.entity.{ts,js}')`. Flattened
  at the image root (`WORKDIR /app`, `COPY dist/apps/api ./`), `__dirname` becomes `/app` and `..`
  resolves to the filesystem root — `initialize()` then recursively globs the *entire container
  filesystem* (`/proc` included) and hangs at 100% CPU, never returning. `docker/backend/Dockerfile`
  instead does `WORKDIR /app`, `COPY dist/apps/api dist/apps/api`, then `WORKDIR
  /app/dist/apps/api` — reproducing the exact bounded shape the repository root gives this same glob
  locally.

## Ephemeral database for acceptance runs — built for `apps/api-e2e`

`apps/api-e2e` now drives its own disposable PostgreSQL through Nx targets, so `pnpm nx e2e api-e2e`
alone reproduces the shape below — no separate script to run by hand, no workflow step to add:

1. `api-e2e:e2e-db-up` runs `docker compose -f docker/docker-compose.e2e.yml up -d --wait` — the
   ephemeral `postgres-e2e` service (port `5499`, database `sport_itsm_e2e`, no volume). `--wait`
   blocks on the compose file's own `pg_isready` healthcheck; never a fixed sleep.
2. `api-e2e:e2e-migrate` (`dependsOn: [e2e-db-up]`) runs the existing `pnpm migration:run` script
   against it — the same script and the same chain a real deploy would use, never `synchronize`.
   Today the chain is empty (**`T-C10-17`** still owns the first migration), so this step only
   creates TypeORM's own `migrations` bookkeeping table and reports "No migrations are pending" — but
   the step is real and already wired, not a placeholder.
3. `api-e2e:serve-under-test` (`dependsOn: [api:build, e2e-migrate]`) boots the API against that
   database only once the chain above has run.
4. `api-e2e:e2e`'s own command is wrapped by `tools/e2e/teardown-after.mjs`, which runs the suite
   (`assert-under-test.mjs` + `cypress run`) and **always** runs `docker compose … down -v` afterwards
   — a passing suite and a failing one tear the stack down the same way, because Nx's `run-commands`
   executor has no native "finally" step.

All five `POSTGRES_*` values are supplied directly in each target's own `env` block (never `.env`,
which stays absent for this target on purpose) and take precedence over whatever the host shell
already exports — verified on a machine with an unrelated project's own global `POSTGRES_*` variables
still set.

Never point an acceptance run at a shared or long-lived database — this is why `apps/api-e2e` never
reuses `docker-compose.dev.yml`'s `sport_itsm_dev`. The suites assert on state, and a suite that
depends on leftover rows is a suite that passes for the wrong reason.

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
