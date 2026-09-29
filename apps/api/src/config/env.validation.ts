import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
  ValidateIf,
  validateSync,
} from 'class-validator';

/**
 * The deployment environments the API recognises. Declared as an enum rather
 * than a free string so that a typo in `NODE_ENV` fails the boot instead of
 * silently selecting the "not production" branch of every conditional.
 */
export enum NodeEnvironment {
  Development = 'development',
  Test = 'test',
  Staging = 'staging',
  Production = 'production',
}

/**
 * The persistence backend the API is wired to (ADR-015 decision 1,
 * `T-C10-75`). Declared the same way `NodeEnvironment` is — an enum, not a
 * free string — so a typo fails the boot instead of silently falling through.
 *
 * There is deliberately **no in-code default**: choosing `memory` (a
 * non-durable store) must be an explicit act of whoever configures the
 * environment, never an inference the validator makes on its own.
 */
export enum PersistenceMode {
  Postgres = 'postgres',
  Memory = 'memory',
}

/**
 * The validated shape of the process environment.
 *
 * This class is the *only* declaration of what the API reads from its
 * environment. Every key is mandatory and has no in-code default: a default
 * would let a missing key boot the process with a plausible-but-wrong value,
 * which is exactly the failure mode `CLAUDE.md` §3 forbids ("no raw
 * `process.env` in feature code") and that this ticket's acceptance criteria
 * test for. Keys are added here as the capabilities that need them arrive —
 * the database connection with `T-C10-16`, observability with `T-C10-28`.
 *
 * `PERSISTENCE_MODE` (`T-C10-75`, ADR-015) is the one exception to "every key
 * is mandatory in every mode": it is itself always mandatory with no default,
 * but it *gates* the `POSTGRES_*` block below — those five keys are mandatory
 * only when `PERSISTENCE_MODE=postgres`. In `memory` mode they are optional
 * and, if present, are never read by any code path (only `postgres`-mode
 * consumers — `buildDatabaseConnectionOptions()`, `database.module.ts` —
 * touch them; see `T-C10-75`'s reported finding on their declared `string`
 * types for `T-C10-78`, which is what actually stops `DatabaseModule` from
 * loading in `memory` mode).
 */
export class EnvironmentVariables {
  @IsEnum(NodeEnvironment, {
    message: `NODE_ENV must be one of: ${Object.values(NodeEnvironment).join(', ')}`,
  })
  NODE_ENV!: NodeEnvironment;

  @IsEnum(PersistenceMode, {
    message: `PERSISTENCE_MODE must be one of: ${Object.values(PersistenceMode).join(', ')}`,
  })
  PERSISTENCE_MODE!: PersistenceMode;

  @IsInt({ message: 'PORT must be an integer' })
  @Min(1, { message: 'PORT must be a valid TCP port (1-65535)' })
  @Max(65535, { message: 'PORT must be a valid TCP port (1-65535)' })
  PORT!: number;

  /**
   * The database connection. The key names mirror the `POSTGRES_*` variables
   * the `postgres` service already declares in `docker/docker-compose.dev.yml`,
   * so a developer sets the same names on both sides of the connection instead
   * of translating between two vocabularies.
   *
   * Mandatory only when `PERSISTENCE_MODE=postgres` (`@ValidateIf` ahead of
   * each decorator below) — optional, and ignored, in `memory` mode.
   */
  @ValidateIf(
    (env: EnvironmentVariables) =>
      env.PERSISTENCE_MODE === PersistenceMode.Postgres,
  )
  @IsNotEmpty({ message: 'POSTGRES_HOST is required' })
  @IsString({ message: 'POSTGRES_HOST must be a string' })
  POSTGRES_HOST!: string;

  @ValidateIf(
    (env: EnvironmentVariables) =>
      env.PERSISTENCE_MODE === PersistenceMode.Postgres,
  )
  @IsInt({ message: 'POSTGRES_PORT must be an integer' })
  @Min(1, { message: 'POSTGRES_PORT must be a valid TCP port (1-65535)' })
  @Max(65535, { message: 'POSTGRES_PORT must be a valid TCP port (1-65535)' })
  POSTGRES_PORT!: number;

  @ValidateIf(
    (env: EnvironmentVariables) =>
      env.PERSISTENCE_MODE === PersistenceMode.Postgres,
  )
  @IsNotEmpty({ message: 'POSTGRES_DB is required' })
  @IsString({ message: 'POSTGRES_DB must be a string' })
  POSTGRES_DB!: string;

  @ValidateIf(
    (env: EnvironmentVariables) =>
      env.PERSISTENCE_MODE === PersistenceMode.Postgres,
  )
  @IsNotEmpty({ message: 'POSTGRES_USER is required' })
  @IsString({ message: 'POSTGRES_USER must be a string' })
  POSTGRES_USER!: string;

  @ValidateIf(
    (env: EnvironmentVariables) =>
      env.PERSISTENCE_MODE === PersistenceMode.Postgres,
  )
  @IsNotEmpty({ message: 'POSTGRES_PASSWORD is required' })
  @IsString({ message: 'POSTGRES_PASSWORD must be a string' })
  POSTGRES_PASSWORD!: string;
}

/**
 * `@nestjs/config`'s `validate` hook: runs once, before any provider is
 * instantiated, and must throw to abort the boot.
 *
 * The returned instance — not the raw environment — becomes the config source,
 * so `ConfigService` hands out values that are already coerced to their
 * declared types (`PORT` is a `number`, never the string `'3300'`).
 *
 * @throws Error naming every offending key, so that an operator reading the
 *   crash sees *which* variable is missing rather than a stack trace about
 *   `undefined`.
 */
export function validateEnvironment(
  raw: Record<string, unknown>,
): EnvironmentVariables {
  const validated = plainToInstance(EnvironmentVariables, raw, {
    // `process.env` values are always strings; the declared types drive the
    // coercion, which is what makes `PORT` an actual number downstream.
    enableImplicitConversion: true,
    excludeExtraneousValues: false,
  });

  const errors = validateSync(validated, {
    skipMissingProperties: false,
    forbidUnknownValues: true,
  });

  if (errors.length > 0) {
    const details = errors
      .map((error) => {
        // An absent key trips every constraint on the property at once, which
        // buries the actual problem under type complaints. Report the cause
        // instead of its symptoms.
        const supplied = raw[error.property];
        if (supplied === undefined || supplied === '') {
          return `  - ${error.property}: required, but not set in the environment`;
        }

        // Distinct reasons only: overlapping range constraints otherwise repeat
        // the same sentence.
        const reasons = [...new Set(Object.values(error.constraints ?? {}))];
        const reason = reasons.length
          ? reasons.join('; ')
          : 'failed validation';
        return `  - ${error.property}: ${reason}`;
      })
      .join('\n');

    throw new Error(
      `Invalid environment configuration. The API will not start.\n${details}`,
    );
  }

  // Cross-field safety rail (ADR-015 decision 1, `T-C10-75`): reached only
  // once the per-property pass above has already returned with zero errors,
  // which is what guarantees both `PERSISTENCE_MODE` and `NODE_ENV` are
  // individually valid before this combination is judged — a malformed key
  // is always reported as *its own* error first, never folded into this
  // message. There is no current production environment (ADR-013), so this
  // rail costs nothing today; it forecloses the worst case (a non-durable
  // store selected in production) mechanically, rather than by convention.
  // Kept as the *only* place this combination is checked — no
  // `if (environment === …)` branch is repeated anywhere else in the code.
  if (
    validated.PERSISTENCE_MODE === PersistenceMode.Memory &&
    validated.NODE_ENV === NodeEnvironment.Production
  ) {
    throw new Error(
      'Invalid environment configuration. The API will not start.\n' +
        "  - PERSISTENCE_MODE: must not be 'memory' when NODE_ENV is 'production'\n" +
        "  - NODE_ENV: must not be 'production' when PERSISTENCE_MODE is 'memory'",
    );
  }

  return validated;
}
