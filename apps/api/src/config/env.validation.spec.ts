// `validateEnvironment()` calls `class-transformer`'s `plainToInstance()` with
// `enableImplicitConversion`, which reads `design:type` metadata through
// `Reflect.getMetadata`. In the running API and in the TypeORM CLI, that
// polyfill is already loaded as a side effect of `@nestjs/core`'s /
// `typeorm/cli.js`'s own entry point (both `require('reflect-metadata')`
// themselves); this spec imports `env.validation.ts` directly, without either
// entry point, so it must load the same polyfill itself.
import 'reflect-metadata';
import {
  NodeEnvironment,
  PersistenceMode,
  validateEnvironment,
} from './env.validation';

/**
 * A minimal, valid `postgres`-mode environment. Every case below starts from
 * this object and overrides only what it needs to change — never reads
 * `process.env`, so this suite's outcome cannot depend on the `POSTGRES_*`
 * variables this machine may already have set globally (`T-C10-75` Trap 5).
 */
function validPostgresEnvironment(): Record<string, unknown> {
  return {
    NODE_ENV: NodeEnvironment.Development,
    PERSISTENCE_MODE: PersistenceMode.Postgres,
    PORT: '3300',
    POSTGRES_HOST: 'localhost',
    POSTGRES_PORT: '5452',
    POSTGRES_DB: 'sport_itsm_dev',
    POSTGRES_USER: 'postgres',
    POSTGRES_PASSWORD: 'postgres',
  };
}

/** A minimal, valid `memory`-mode environment: no POSTGRES_* key at all. */
function validMemoryEnvironment(): Record<string, unknown> {
  return {
    NODE_ENV: NodeEnvironment.Development,
    PERSISTENCE_MODE: PersistenceMode.Memory,
    PORT: '3300',
  };
}

describe('validateEnvironment — PERSISTENCE_MODE (T-C10-75, ADR-015)', () => {
  it('passes with PERSISTENCE_MODE=postgres and every POSTGRES_* key present', () => {
    expect(() => validateEnvironment(validPostgresEnvironment())).not.toThrow();
  });

  it('passes with PERSISTENCE_MODE=memory and no POSTGRES_* key set at all', () => {
    expect(() => validateEnvironment(validMemoryEnvironment())).not.toThrow();
  });

  it('fails fast naming PERSISTENCE_MODE when the key is absent', () => {
    const raw = validPostgresEnvironment();
    delete raw.PERSISTENCE_MODE;

    expect(() => validateEnvironment(raw)).toThrow(
      /PERSISTENCE_MODE: required, but not set in the environment/,
    );
  });

  it('fails naming PERSISTENCE_MODE when the value is not a recognised mode', () => {
    const raw = validPostgresEnvironment();
    raw.PERSISTENCE_MODE = 'sqlite';

    expect(() => validateEnvironment(raw)).toThrow(
      /PERSISTENCE_MODE must be one of: postgres, memory/,
    );
  });

  describe('POSTGRES_* becomes conditionally required (@ValidateIf)', () => {
    const postgresOnlyKeys = [
      'POSTGRES_HOST',
      'POSTGRES_PORT',
      'POSTGRES_DB',
      'POSTGRES_USER',
      'POSTGRES_PASSWORD',
    ] as const;

    it.each(postgresOnlyKeys)(
      'still fails fast when %s is missing in postgres mode',
      (key) => {
        const raw = validPostgresEnvironment();
        delete raw[key];

        expect(() => validateEnvironment(raw)).toThrow(
          new RegExp(`${key}: required, but not set in the environment`),
        );
      },
    );

    it('does not require any POSTGRES_* key in memory mode, even if malformed', () => {
      const raw = validMemoryEnvironment();
      // Present but nonsensical — @ValidateIf must skip every decorator below
      // it when PERSISTENCE_MODE is not 'postgres', so this must never surface.
      raw.POSTGRES_PORT = 'not-a-port';

      expect(() => validateEnvironment(raw)).not.toThrow();
    });
  });

  describe('the memory + production safety rail', () => {
    it('fails naming both PERSISTENCE_MODE and NODE_ENV when memory is selected in production', () => {
      const raw = validMemoryEnvironment();
      raw.NODE_ENV = NodeEnvironment.Production;

      expect(() => validateEnvironment(raw)).toThrow(
        /PERSISTENCE_MODE:.*production[\s\S]*NODE_ENV:.*memory/,
      );
    });

    it('does not trigger for memory + staging', () => {
      const raw = validMemoryEnvironment();
      raw.NODE_ENV = NodeEnvironment.Staging;

      expect(() => validateEnvironment(raw)).not.toThrow();
    });

    it('does not trigger for postgres + production', () => {
      const raw = validPostgresEnvironment();
      raw.NODE_ENV = NodeEnvironment.Production;

      expect(() => validateEnvironment(raw)).not.toThrow();
    });

    it('reports per-property errors instead of the rail when other keys are also invalid', () => {
      // PERSISTENCE_MODE itself is malformed here, so the rail (which needs
      // both keys already valid) must never run — the per-property error is
      // reported on its own, exactly as it is without this ticket's rail.
      const raw = validMemoryEnvironment();
      raw.NODE_ENV = NodeEnvironment.Production;
      raw.PERSISTENCE_MODE = 'sqlite';

      expect(() => validateEnvironment(raw)).toThrow(
        /PERSISTENCE_MODE must be one of: postgres, memory/,
      );
    });
  });
});
