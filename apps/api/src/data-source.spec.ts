// See `env.validation.spec.ts` for why this polyfill has to be loaded by hand
// here: `data-source.ts`'s guard calls `loadEnvironment()` →
// `validateEnvironment()` → `class-transformer`'s `plainToInstance()`, and
// this spec imports that chain directly, without the `@nestjs/core` /
// `typeorm/cli.js` entry point that loads it in every real invocation.
import 'reflect-metadata';
import { NodeEnvironment, PersistenceMode } from './config/env.validation';

/**
 * Proves the TypeORM CLI guard (`T-C10-75`, ADR-015):
 * `apps/api/src/data-source.ts` refuses to construct a `DataSource` outside
 * `postgres` mode, and does so before either `buildDatabaseConnectionOptions()`
 * or the `DataSource` constructor ever runs.
 *
 * Each case isolates the module registry (`jest.isolateModulesAsync`) and
 * fixes `process.env` explicitly for that case, restoring it in `afterEach` —
 * the same isolation `test-event-dispatch.harness-gating.spec.ts` uses for the
 * same reason: `data-source.ts` reads its environment once, at
 * module-evaluation time, through `loadEnvironment()`. Both `typeorm`'s
 * `DataSource` and this repo's own `buildDatabaseConnectionOptions()` are
 * mocked so the assertions below are about *whether they were called*, never
 * about opening a real connection.
 */
describe('data-source CLI guard (T-C10-75, ADR-015)', () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = originalEnv;
    jest.resetModules();
  });

  it('throws naming PERSISTENCE_MODE and never calls buildDatabaseConnectionOptions() or the DataSource constructor in memory mode', async () => {
    const dataSourceCtor = jest.fn();
    const buildDatabaseConnectionOptions = jest.fn();

    await expect(
      jest.isolateModulesAsync(async () => {
        process.env = {
          ...originalEnv,
          NODE_ENV: NodeEnvironment.Development,
          PERSISTENCE_MODE: PersistenceMode.Memory,
          PORT: '3300',
        };

        jest.doMock('typeorm', () => ({ DataSource: dataSourceCtor }));
        jest.doMock('./config/database-connection', () => ({
          buildDatabaseConnectionOptions,
        }));

        await import('./data-source');
      }),
    ).rejects.toThrow(/PERSISTENCE_MODE=memory/);

    expect(buildDatabaseConnectionOptions).not.toHaveBeenCalled();
    expect(dataSourceCtor).not.toHaveBeenCalled();
  });

  it('builds a DataSource without connecting when PERSISTENCE_MODE=postgres', async () => {
    const dataSourceCtor = jest.fn();
    const connectionOptions = {
      type: 'postgres' as const,
      host: 'localhost',
      port: 5452,
      username: 'postgres',
      password: 'postgres',
      database: 'sport_itsm_dev',
      synchronize: false,
      migrationsRun: false,
    };
    const buildDatabaseConnectionOptions = jest.fn(() => connectionOptions);

    await jest.isolateModulesAsync(async () => {
      process.env = {
        ...originalEnv,
        NODE_ENV: NodeEnvironment.Development,
        PERSISTENCE_MODE: PersistenceMode.Postgres,
        PORT: '3300',
        POSTGRES_HOST: 'localhost',
        POSTGRES_PORT: '5452',
        POSTGRES_DB: 'sport_itsm_dev',
        POSTGRES_USER: 'postgres',
        POSTGRES_PASSWORD: 'postgres',
      };

      jest.doMock('typeorm', () => ({ DataSource: dataSourceCtor }));
      jest.doMock('./config/database-connection', () => ({
        buildDatabaseConnectionOptions,
      }));

      await import('./data-source');
    });

    expect(buildDatabaseConnectionOptions).toHaveBeenCalledTimes(1);
    expect(dataSourceCtor).toHaveBeenCalledTimes(1);
    // No `.initialize()`/`.connect()` call is ever made — the mock constructor
    // is never given the chance to open a socket, which is what "without
    // connecting" means for a CLI-only DataSource (AC7).
    expect(dataSourceCtor.mock.calls[0][0]).toMatchObject(connectionOptions);
  });
});
