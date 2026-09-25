import { EnvironmentVariables, validateEnvironment } from './env.validation';

/**
 * Reads and validates the process environment, outside any Nest context.
 *
 * `ConfigModule` is the only reader of the environment while the application
 * runs, but the TypeORM CLI loads `apps/api/src/data-source.ts` as a plain
 * script — no Nest application, no DI container, no `ConfigService` to inject.
 * This function is what lets that file obtain the same validated, coerced
 * values through the same schema, instead of reaching for `process.env` itself
 * and silently accepting whatever is there.
 *
 * Reading `process.env` is a privilege of this folder (`CLAUDE.md` §3), which
 * is why the call lives here and not in the data source.
 *
 * @throws Error naming every missing or malformed key, exactly as a failed boot
 *   does — the CLI refuses to connect for the same reasons the API refuses to
 *   start.
 */
export function loadEnvironment(): EnvironmentVariables {
  return validateEnvironment(process.env);
}
