---
name: project-datasource-boot-must-stay-lazy
description: Any global TypeORM DataSource provider in apps/api must connect lazily, not eagerly in its module factory — eager connect breaks an untouchable existing unit test.
metadata:
  type: project
---

`apps/api/src/testing/test-event-dispatch.harness-gating.spec.ts` boots a full
`AppModule` (via `NestFactory.create`) with placeholder `POSTGRES_*` values,
under the explicit stated assumption "No database is ever contacted". That
file is inside `apps/api/src/testing/**`, which backend-engineer tickets are
told not to touch (ticket boundary, not a general repo rule — verify per-task,
but it recurred on `T-C1-06`).

`T-C1-06` needed a global `DataSource` provider (`apps/api/src/database/database.module.ts`)
so `TypeOrmIncidentRepository` could be constructed. Calling
`dataSource.initialize()` eagerly inside the module's `useFactory` — the
literal reading of "the API needs PostgreSQL to boot" — makes `NestFactory.create(AppModule)`
try to open a real socket on every boot, including that harness-gating spec's
four boots with fake credentials. Confirmed empirically: eager connect turns
`pnpm nx test api` red with `ECONNREFUSED`/auth failures and no way to fix it
without editing the forbidden file.

**Fix applied:** `DatabaseModule`'s factory only does `new DataSource(options)`
(builds options + entity metadata in memory, opens no socket) and logs the
registered entity class names for a boot-time proof the entity survived
bundling. `TypeOrmIncidentRepository` (the actual DB-touching provider) opens
the connection itself, lazily, on first real use, via a memoized
`ensureInitialized()` promise field (guards against two concurrent callers
racing two `initialize()` calls, which TypeORM rejects outright).

**Consequence, reported rather than silently accepted:** this means the API
does **not** need PostgreSQL to boot after all (only to serve any request that
reaches an incident repository) — a deliberate, reported deviation from what
the ticket text assumed, not an oversight.

**How to apply:** any future context's first `DataSource`-backed repository
adapter (T-C1-04's sequence work, the six other entities' first repositories,
`service-request`/`sla`/etc.'s first adapters) should reuse this lazy-connect
pattern rather than re-introducing eager connection in a shared module
factory — check `apps/api/src/testing/**` and `apps/api/src/event-dispatch/**`
for assumptions about DB-free boots before changing global provider wiring in
`apps/api/src/app/app.module.ts`.
