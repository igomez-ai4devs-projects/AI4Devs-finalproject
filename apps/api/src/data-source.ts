import { DataSource } from 'typeorm';
import { join } from 'node:path';
import { loadEnvironment } from './config/environment';

const environment = loadEnvironment();

/**
 * The TypeORM data source: the one description of how this application reaches
 * PostgreSQL, used both by the running API and by the TypeORM CLI that
 * generates, runs and reverts migrations.
 *
 * Two rules are structural here rather than conventional:
 *
 * - **`synchronize` is `false`, in every environment.** Schema changes happen
 *   through migrations only (`CLAUDE.md` §2/§3). There is no code path that
 *   sets it to `true`, not even for tests: a schema that can drift from its
 *   migrations is a schema nobody can reproduce.
 * - **`migrationsRun` is `false`.** Applying migrations is a controlled deploy
 *   step, never an unconditional side effect of a process starting — several
 *   API instances booting at once would otherwise race each other through the
 *   same migration chain.
 *
 * Connection values arrive already validated and coerced from the same schema
 * the API boots with, so the CLI cannot connect with a configuration the
 * application would have rejected.
 */
export const dataSource = new DataSource({
  type: 'postgres',
  host: environment.POSTGRES_HOST,
  port: environment.POSTGRES_PORT,
  username: environment.POSTGRES_USER,
  password: environment.POSTGRES_PASSWORD,
  database: environment.POSTGRES_DB,
  synchronize: false,
  migrationsRun: false,
  // Every entity lives in its bounded context's own infrastructure library
  // (`libs/<context>/infrastructure/src/**/*.entity.ts`), never in `apps/api`
  // itself — `ARCHITECTURE.md` §6.3, §5.4. `apps/api/src` is *not* an ancestor
  // of `libs/`, so a single `join(__dirname, '..', '**', ...)` glob (as it
  // read before this ticket) can only ever search inside `apps/api` and would
  // never reach a context library; it was a placeholder for this ticket to
  // resolve, per its own comment.
  //
  // `T-C1-02` registers only the `incident` entry below (no entity exists
  // yet — the glob simply matches nothing today). Each later context adds its
  // own array entry the same way, rather than this list ever growing a
  // wildcard segment: a wildcard (`libs/*/infrastructure/src/...`) would also
  // match any future non-context `libs/*/infrastructure` directory sight
  // unseen, and the migrations glob below stays a single pattern only because
  // every migration file already lives in one shared folder, which is not
  // true of entities.
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
  //   (`T-C10-69`'s `/proc` incident), and, since nothing under `libs/` is
  //   copied into the image (only `dist/apps/api` is), it resolves to a path
  //   that does not exist and matches nothing, which is exactly what happens
  //   locally today too (no entity has been written yet). No path alias
  //   (`@sport-itsm/incident-infrastructure`) is imported here instead: `tsc`
  //   does not rewrite path aliases when compiling this file in isolation
  //   (`tsconfig.migrations.json` has no bundler behind it), so a compiled
  //   `require('@sport-itsm/incident-infrastructure')` would fail in the
  //   image. See the finding in this ticket's report: once `T-C1-06` adds the
  //   first entity, the image will need that file compiled and copied into
  //   `dist/`, or this data source will need a different strategy — not
  //   solved here, since no entity exists yet to prove it against.
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
