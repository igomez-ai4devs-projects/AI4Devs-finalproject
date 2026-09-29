import type { DataSourceOptions } from 'typeorm';
import { loadEnvironment } from './environment';

/**
 * The connection-only half of a TypeORM `DataSourceOptions` — everything
 * except `entities` and `migrations`, which differ between the two consumers
 * that need a `DataSource` (`T-C1-06` Trap 3):
 *
 * - **The TypeORM CLI** (`apps/api/src/data-source.ts`) registers entities by
 *   a glob path and migrations by a glob path; that file is compiled in
 *   isolation by `tsc` (`apps/api/tsconfig.migrations.json`), which does not
 *   rewrite path aliases, so it cannot `import` an entity class from
 *   `@sport-itsm/incident-infrastructure`.
 * - **The running API** (`apps/api/src/database/database.module.ts`)
 *   registers entities by explicit class reference, because it is bundled by
 *   webpack, which *does* resolve that alias into the single `main.js` chunk
 *   the deployed image ships — a glob resolved at runtime against
 *   `dist/apps/api` would not find anything there (`docker/backend/Dockerfile`
 *   copies only `dist/apps/api`, never `libs/`).
 *
 * Both call this same function so the connection itself — host, port,
 * credentials, database, and the two non-negotiable flags — is declared
 * exactly once, with **no `if (environment === …)` branch** anywhere in
 * either consumer: the difference between them is confined to `entities`,
 * which each one supplies for itself after calling this function.
 *
 * `synchronize: false` and `migrationsRun: false` are asserted here, not left
 * to each caller to repeat correctly (`CLAUDE.md` §2/§3, `DATA-MODEL.md`
 * §3.7): schema changes happen through migrations only, applied as an
 * explicit step, never as an unconditional side effect of a process starting
 * — several API instances booting at once would otherwise race each other
 * through the same migration chain.
 *
 * **`T-C1-06`'s own finding on this ticket's AC4.** AC4 as written says
 * "migrations auto-run only when `NODE_ENV=development`". `DATA-MODEL.md`
 * §3.7 (already corrected, and read as authoritative per this ticket's own
 * `## Context`) says the opposite: migrations never auto-run, in any
 * environment, because the API scales horizontally. `migrationsRun` is
 * therefore unconditionally `false` below — no environment gate is
 * implemented — and the AC4 wording is reported as a contradiction for
 * `architect-tech-lead` to reconcile, rather than implemented as written.
 */
export function buildDatabaseConnectionOptions(): Omit<
  Extract<DataSourceOptions, { type: 'postgres' }>,
  'entities' | 'migrations'
> {
  const environment = loadEnvironment();
  return {
    type: 'postgres',
    host: environment.POSTGRES_HOST,
    port: environment.POSTGRES_PORT,
    username: environment.POSTGRES_USER,
    password: environment.POSTGRES_PASSWORD,
    database: environment.POSTGRES_DB,
    synchronize: false,
    migrationsRun: false,
  };
}
