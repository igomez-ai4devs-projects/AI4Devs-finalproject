import { DataSource } from 'typeorm';
import { join } from 'node:path';
import { buildDatabaseConnectionOptions } from './config/database-connection';

/**
 * The TypeORM data source used by the TypeORM CLI (`migration:generate` /
 * `run` / `revert` / `show`) to reach PostgreSQL.
 *
 * Connection values (`synchronize: false`, `migrationsRun: false`, host,
 * credentials…) come from `buildDatabaseConnectionOptions()`
 * (`config/database-connection.ts`), the single place that declares them —
 * see that function's own doc comment for why, and for `T-C1-06`'s reported
 * finding on this ticket's AC4. This file supplies only what the CLI
 * specifically needs on top: entities and migrations, both registered by
 * glob (`T-C1-06` Trap 3 — the running API registers entities differently;
 * see `apps/api/src/database/database.module.ts`).
 */
export const dataSource = new DataSource({
  ...buildDatabaseConnectionOptions(),
  // Every entity lives in its bounded context's own infrastructure library
  // (`libs/<context>/infrastructure/src/**/*.entity.ts`), never in `apps/api`
  // itself — `ARCHITECTURE.md` §6.3, §5.4. `apps/api/src` is *not* an ancestor
  // of `libs/`, so a single `join(__dirname, '..', '**', ...)` glob (as it
  // read before `T-C1-02`) can only ever search inside `apps/api` and would
  // never reach a context library.
  //
  // `T-C1-06` adds the first real entry (`incident`, its first entity — see
  // `libs/incident/infrastructure/src/lib/incident.entity.ts`). Each later
  // context appends its own array entry the same way, rather than this list
  // ever growing a wildcard segment: a wildcard (`libs/*/infrastructure/src/...`)
  // would also match any future non-context `libs/*/infrastructure` directory
  // sight unseen, and the migrations glob below stays a single pattern only
  // because every migration file already lives in one shared folder, which is
  // not true of entities.
  //
  // The path is built the same way in both places this file runs, with no
  // `if (environment === …)` branch:
  // - **Local (CLI via `ts-node`, `tools/typeorm.cjs`)**: `__dirname` is the
  //   real `apps/api/src`, three levels below the repository root, so
  //   `join(__dirname, '..', '..', '..', 'libs', ...)` lands on
  //   `<repo>/libs/incident/infrastructure/src/**/*.entity.ts`.
  // - **Deployed image**: `apps/api/tsconfig.migrations.json` compiles this
  //   file to `dist/apps/api/data-source.js`, so `__dirname` there is
  //   `/app/dist/apps/api` (`docker/backend/Dockerfile`). The same three
  //   `..` segments land on `/app/libs/incident/infrastructure/src/...` —
  //   still bounded under the image's `/app` root, not the filesystem root
  //   (`T-C10-69`'s `/proc` incident) — but nothing under `libs/` is copied
  //   into the image (only `dist/apps/api` is), so **this glob matches
  //   nothing inside the deployed image, and this data source is never used
  //   to run migrations there either** (ADR-013 runs `migration:run:deploy`
  //   against the compiled `dist/apps/api/data-source.js`, a separate build
  //   artifact of this same file — same glob, same empty match). This data
  //   source is a CLI-only tool; the entity that actually has to be present
  //   at runtime is registered by class reference in
  //   `apps/api/src/database/database.module.ts` instead — a different
  //   `DataSource`, for a different consumer, built by
  //   `buildDatabaseConnectionOptions()` with the same connection settings
  //   (`T-C1-06` Trap 3, reported for `ci-cd-expert` to verify against the
  //   actual deployed image).
  entities: [
    join(
      __dirname,
      '..',
      '..',
      '..',
      'libs',
      'incident',
      'infrastructure',
      'src',
      '**',
      '*.entity.{ts,js}',
    ),
  ],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
});
