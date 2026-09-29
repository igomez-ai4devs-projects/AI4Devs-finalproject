import type { INestApplicationContext } from '@nestjs/common';
import { NodeEnvironment, PersistenceMode } from '../config/env.validation';

/**
 * `T-C10-78` AC1/AC2 — `AppModule`'s own env → mode wiring, proven by
 * actually booting it under a real environment, inside `jest.isolateModulesAsync`
 * — the same pattern `../testing/test-event-dispatch.harness-gating.spec.ts`
 * already established, for the identical reason: `app.module.ts` decides its
 * own import list at module-evaluation time via `loadEnvironment()`, so a
 * fresh module registry is the only way to make it re-read the environment
 * each case just set.
 *
 * **This file never imports any `@sport-itsm/*` workspace library, statically
 * or dynamically.** An early version of this suite did — both to obtain
 * `INCIDENT_REPOSITORY`/`InMemoryIncidentRepository`/`TypeOrmIncidentRepository`
 * with identity matching whatever `AppModule`'s freshly-reimported graph bound
 * its providers under (`jest.isolateModulesAsync` sandboxes the *entire*
 * module registry, so a class/token imported outside the sandbox is a
 * *different* identity than the one bound inside it, and `context.get(token)`
 * keys strictly on identity) — and, separately, to assert on the repository
 * in an `AC7` end-to-end case that used to live in this same file. Both
 * attempts tripped `@nx/enforce-module-boundaries`'s lazy-loaded-library
 * check: as soon as *any* file contains both a dynamic `import()`/`require()`
 * *and* an ordinary static import of a workspace library
 * (`@sport-itsm/incident-domain` et al.), that library is treated as
 * "lazy-loaded", and then *every other* static import of it across the whole
 * repository is flagged as an error (confirmed empirically — 20+ unrelated
 * files failed lint). `CLAUDE.md` §3 forbids relaxing `@nx/enforce-module-
 * boundaries` to make an import compile ("the fix is always the design"), so
 * the fix is architectural, not a config exception: this file proves only
 * what it can prove without ever naming a workspace library — `DataSource`
 * presence/absence, via `typeorm` (an external npm package, not an Nx
 * project, so dynamically importing it is invisible to that rule — the same
 * reason the harness-gating spec's own dynamic imports of `@nestjs/core` and
 * `../app/app.module`, both likewise outside the Nx project graph as *this
 * project's own files*, never trip it either).
 *
 * The repository-identity claim this file used to make
 * ("`INCIDENT_REPOSITORY` *is* `InMemoryIncidentRepository` in `memory`
 * mode") is proven instead, safely, in the two places that claim decomposes
 * into: `../persistence/persistence.module.spec.ts` (the `DatabaseModule`-
 * inclusion mechanic `PersistenceModule.forMode()` itself owns, as a pure
 * function of `mode`) and `./incident/incident.module.spec.ts`'s own AC5 case
 * (the real binding, composed directly via
 * `PersistenceModule.forMode(PersistenceMode.Memory)`, no environment or
 * isolation involved). The AC7 end-to-end proof (log an Incident, read it
 * back, with no HTTP and no database) moved to
 * `./incident/log-and-read-incident.memory-mode.spec.ts` for the same reason:
 * it needs `LogIncidentUseCase`/`GetIncidentByReferenceUseCase`/
 * `INCIDENT_REPOSITORY` by identity, which only ordinary static imports (no
 * `jest.isolateModulesAsync`, no environment variable at all —
 * `PersistenceModule.forMode()` takes `mode` as a plain parameter) can give
 * safely.
 */

const POSTGRES_ENV_KEYS = [
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_DB',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
] as const;

/**
 * This machine carries global `POSTGRES_*` variables from an unrelated
 * project (`.claude/agent-memory/backend-engineer/feedback_typeorm_cli_env_shadowing.md`).
 * Spreading `process.env` and only *overriding* keys — the harness-gating
 * spec's own pattern — would leave those five untouched; this suite instead
 * builds a fresh object that never carries them, which is the only way to
 * prove "no `POSTGRES_*` variable set" rather than merely "no `POSTGRES_*`
 * variable this suite happened to override".
 */
function environmentWithout(
  keys: readonly string[],
  overrides: Record<string, string>,
): NodeJS.ProcessEnv {
  const next: NodeJS.ProcessEnv = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (!keys.includes(key) && value !== undefined) {
      next[key] = value;
    }
  }
  return { ...next, ...overrides };
}

/**
 * Boots a fresh `AppModule` under `env`, hands the resulting context and the
 * `DataSource` class (as resolved inside the *same* sandboxed registry — see
 * this file's own doc comment on identity) to `run`, then closes the context.
 */
async function bootAppModuleUnder(
  env: NodeJS.ProcessEnv,
  run: (handles: {
    context: INestApplicationContext;
    DataSource: typeof import('typeorm').DataSource;
  }) => Promise<void>,
): Promise<void> {
  await jest.isolateModulesAsync(async () => {
    process.env = env;

    const { NestFactory } = await import('@nestjs/core');
    const { AppModule } = await import('./app.module');
    const { DataSource } = await import('typeorm');

    const context = await NestFactory.createApplicationContext(AppModule, {
      logger: false,
    });

    try {
      await run({ context, DataSource });
    } finally {
      await context.close();
    }
  });
}

describe('AppModule boots the right persistence mode from PERSISTENCE_MODE (T-C10-78 AC1/AC2)', () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = originalEnv;
  });

  it('boots in memory mode with no POSTGRES_* set and no DataSource provider registered (AC2)', async () => {
    const env = environmentWithout(POSTGRES_ENV_KEYS, {
      NODE_ENV: NodeEnvironment.Staging,
      PERSISTENCE_MODE: PersistenceMode.Memory,
      PORT: '3000',
    });
    // Belt and braces: the assertion below is what actually matters, but
    // failing loudly here (rather than deep inside DI resolution) is a
    // clearer signal if this machine's global POSTGRES_* variables ever
    // leak back in some other way.
    for (const key of POSTGRES_ENV_KEYS) {
      expect(env[key]).toBeUndefined();
    }

    await bootAppModuleUnder(env, async ({ context, DataSource }) => {
      expect(() => context.get(DataSource)).toThrow();
    });
  }, 30_000);

  it('boots in postgres mode with a lazy, unconnected DataSource provider registered (AC1, mirror case)', async () => {
    const env = {
      ...process.env,
      NODE_ENV: NodeEnvironment.Staging,
      PERSISTENCE_MODE: PersistenceMode.Postgres,
      PORT: '3000',
      POSTGRES_HOST: 'unreachable-fixture-host.invalid',
      POSTGRES_PORT: '5432',
      POSTGRES_DB: 'unused-fixture-db',
      POSTGRES_USER: 'unused-fixture-user',
      POSTGRES_PASSWORD: 'unused-fixture-password',
    };

    await bootAppModuleUnder(env, async ({ context, DataSource }) => {
      const dataSource = context.get(DataSource);
      expect(dataSource).toBeInstanceOf(DataSource);
      // Constructed, never connected (`database.module.ts`'s own doc
      // comment) — fictitious credentials never had to be reachable.
      expect(dataSource.isInitialized).toBe(false);
    });
  }, 30_000);
});
