import type { DataSourceOptions } from 'typeorm';
import { IncidentEntity } from '@sport-itsm/incident-infrastructure';
import { buildDatabaseConnectionOptions } from '../config/database-connection';

/**
 * Entities registered **by class reference** for the `DataSource` the running
 * API opens at boot (`T-C1-06` Trap 3) — the counterpart to `data-source.ts`'s
 * glob, which only ever works for the CLI (see that file's own comment).
 *
 * `apps/api/webpack.config.js` bundles `apps/api` through the Nx webpack
 * plugin (`tsConfig: './tsconfig.app.json'`), which *does* resolve the
 * `@sport-itsm/*` path aliases — unlike `tsconfig.migrations.json`'s isolated
 * `tsc` compile — so a static `import` here lands the entity class inside the
 * single `dist/apps/api/main.js` chunk the deployed image ships
 * (`docker/backend/Dockerfile`). A glob resolved at runtime against
 * `dist/apps/api` would find nothing there: only `dist/apps/api` is copied
 * into the image, never `libs/`.
 *
 * Each later context ticket appends its own entity class to this array — the
 * same additive convention `data-source.ts` documents for its own glob.
 */
export const RUNTIME_ENTITIES = [IncidentEntity];

/**
 * Builds the `DataSourceOptions` the running API uses to open its own
 * connection (`apps/api/src/database/database.module.ts`). Connection
 * settings come from `buildDatabaseConnectionOptions()` — the same function
 * `data-source.ts` calls for the CLI — so there is exactly one place that
 * declares host/credentials/`synchronize`/`migrationsRun`, never two copies
 * that could drift (`T-C1-06` Trap 3).
 */
export function buildRuntimeDataSourceOptions(): DataSourceOptions {
  return {
    ...buildDatabaseConnectionOptions(),
    entities: RUNTIME_ENTITIES,
  };
}
