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
  // Migrations arrive with T-C10-17; entities with the first context library.
  // The globs are declared now so that neither ticket has to reshape this file.
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
});
