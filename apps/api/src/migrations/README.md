# Migration conventions

This directory holds every TypeORM migration for the `api` project, starting with the bootstrap
migration (`T-C10-17`). Every later epic adds migrations here; the rules below are fixed once so no
later ticket has to rediscover them.

## Naming

- File: `<timestamp>-<PascalCaseName>.ts` (`<timestamp>` is `Date.now()` at generation time — the
  same convention `migration:generate` uses).
- Class: `<PascalCaseName><timestamp>`, implementing `MigrationInterface`.
- Migrations that touch generated tables (once entities exist) are still written or reviewed by
  hand — `docs/product/DATA-MODEL.md` §19: "the generated migrations are a draft, not an authority."
  This bootstrap migration has no entity behind it, so it is hand-written SQL from the start
  (`queryRunner.query`), never `migration:generate`.

## Registration — one glob, no environment branch

`apps/api/src/data-source.ts` registers migrations with a single glob,
`join(__dirname, 'migrations', '*.{ts,js}')`. It resolves both the local `.ts` source (run through
`ts-node` by `tools/typeorm.cjs`) and the compiled `.js` the deployed image ships (`T-C10-69`), with
no `if (environment === …)` branch in code. Keep it that way: a glob that only matches `.js` makes
the CLI load zero migrations and fail quietly against a `.ts`-only checkout, and a glob that only
matches `.ts` does the same against a `dist/` that ships only compiled output
(`.claude/skills/ci-cd/references/gotchas.md`, "TypeORM CLI entity globs must match what the image
ships" — the same failure mode applies to `entities` and to `migrations`).

## Reversibility

Every migration in this repository is reversible, and its `down` is run — not just read — before
the migration is considered done. `run → revert → run` must reach the same state both times it is
executed.

**Extensions and `down`, a documented decision.** The bootstrap migration's `down` drops the two
extensions its `up` creates (`citext`, `pg_trgm`), because it is the first migration in the chain and
so is provably their only creator here — nothing earlier could have installed them, so `down` cannot
remove an extension this migration did not itself install. This reasoning is specific to being first:
a **later** migration that needs an extension already installed by an earlier one must not blindly
`DROP EXTENSION` on its own `down` — that would remove something it does not own. That later
migration's `down` should leave the extension alone (or gate the drop on evidence it was the
installer) and say so in a comment, rather than copy this migration's unconditional drop.

No third extension is introduced for identifier generation: `uuidv7()` is a PostgreSQL 18 **core**
function (see below), not a contrib extension.

## Primary-key default

Every migration that creates a table with a UUID primary key declares it exactly as
`docs/product/DATA-MODEL.md` §3.1/§3.1.1 specifies:

```sql
id uuid PRIMARY KEY DEFAULT uuidv7()
```

This is the **settled** convention, not an open question: the application always supplies the id
(UUID v7) through the repository port before any I/O happens (ADR-005, `ARCHITECTURE.md` §6.2); the
database default is a **safety net only**, for migrations and fixtures that write outside that port.
The safety net is v7 — not `gen_random_uuid()` — so a row written outside the port cannot silently
break the time-ordering property the model relies on for index locality on high-insert tables
(`DATA-MODEL.md` §3.1.1, ADR-012).

**Floor this carries:** `uuidv7()` is a PostgreSQL 18 core function and does not exist on earlier
majors. The server major pinned in `CLAUDE.md` §2 (**PostgreSQL 18**) must never be lowered without a
fresh architecture decision — doing so breaks every migration in this repository at the first
`CREATE TABLE`, not at some later point.

## Schema names

Use the actual Postgres schema name a migration creates or references — `iam`, `incident`,
`service_request`, and so on (`docs/product/DATA-MODEL.md` §6–§15) — never the Nx bounded-context
slug (`identity_access`, `service-request`). The slug and the schema name intentionally differ for
`identity-access` → `iam`; every migration in every context must create and reference the schema
name, not a snake-cased copy of the context slug.
