import type { INestApplication } from '@nestjs/common';
import { GLOBAL_PREFIX } from '../app/global-prefix';
import { NodeEnvironment } from '../config/env.validation';

const ROUTE_PATH = '/test-harness/events/dispatch-with-failing-subscriber';

/**
 * Each case re-imports and compiles the whole `AppModule` graph inside a fresh
 * module registry (see `bootApiUnder`), which routinely takes several seconds
 * and far longer while Jest runs other suites in parallel workers. Jest's
 * default 5 s budget made this suite fail intermittently under load, so each
 * case declares its own, generous budget.
 */
const BOOT_AND_REQUEST_TIMEOUT_MS = 60_000;

/**
 * A minimal, valid environment for booting `AppModule` in this suite. No
 * database is ever contacted — the `DataSource` connects lazily, on the first
 * repository call (T-C1-06), and this route makes none — so these
 * `POSTGRES_*` values only need to satisfy `env.validation.ts`.
 */
const BASE_ENVIRONMENT = {
  // Only has to pass validation (1-65535): the suite never reads it, because
  // `bootApiUnder` listens on an OS-assigned port instead.
  PORT: '3000',
  // T-C10-75 (ADR-015): fixed to 'postgres' so this fixture keeps exercising
  // the path it always has — this suite proves the NODE_ENV=test-only route
  // gating, nothing about persistence mode.
  PERSISTENCE_MODE: 'postgres',
  POSTGRES_HOST: 'localhost',
  POSTGRES_PORT: '5432',
  POSTGRES_DB: 'harness-gating-unused',
  POSTGRES_USER: 'harness-gating-unused',
  POSTGRES_PASSWORD: 'harness-gating-unused',
};

/**
 * Boots a fresh `AppModule` under the given `NODE_ENV`, listening on a real
 * TCP port, so this suite can assert — with a real HTTP request, the same way
 * the API-E2E harness (Cypress) exercises this route — that the test-only
 * dispatch route exists **only** when `NODE_ENV=test` (Trap 3 of this
 * ticket's brief).
 *
 * `jest.isolateModulesAsync` is required because `app.module.ts` decides its
 * own import list at module-evaluation time (`loadEnvironment()` runs once,
 * at the top of that file) — a fresh module registry is the only way to make
 * it re-read the environment this test just set.
 */
async function bootApiUnder(
  nodeEnv: NodeEnvironment,
): Promise<INestApplication> {
  let app!: INestApplication;

  await jest.isolateModulesAsync(async () => {
    process.env = {
      ...process.env,
      ...BASE_ENVIRONMENT,
      NODE_ENV: nodeEnv,
    };

    const { NestFactory } = await import('@nestjs/core');
    const { AppModule } = await import('../app/app.module');

    app = await NestFactory.create(AppModule, { logger: false });
    app.setGlobalPrefix(GLOBAL_PREFIX);
    // Port 0: the OS assigns a free port, so a fixed port can never collide
    // with another process or with a previous case still releasing it.
    await app.listen(0);
  });

  return app;
}

/** The harness route's URL on whichever port `app` was actually given. */
function routeUrlOf(app: INestApplication): string {
  const { port } = app.getHttpServer().address() as { port: number };
  return `http://localhost:${port}/${GLOBAL_PREFIX}${ROUTE_PATH}`;
}

describe('event-dispatch test harness route gating (Trap 3)', () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = originalEnv;
  });

  it(
    'exists and proves subscriber isolation over HTTP when NODE_ENV=test',
    async () => {
      const app = await bootApiUnder(NodeEnvironment.Test);

      try {
        const response = await fetch(routeUrlOf(app), { method: 'POST' });

        expect(response.status).toBe(201);
        const body = (await response.json()) as {
          correlationId: string;
          healthySubscriberReceivedEvent: boolean;
        };
        expect(typeof body.correlationId).toBe('string');
        expect(body.correlationId.length).toBeGreaterThan(0);
        expect(body.healthySubscriberReceivedEvent).toBe(true);
      } finally {
        await app.close();
      }
    },
    BOOT_AND_REQUEST_TIMEOUT_MS,
  );

  it(
    'answers 404 when NODE_ENV=development',
    async () => {
      const app = await bootApiUnder(NodeEnvironment.Development);

      try {
        const response = await fetch(routeUrlOf(app), { method: 'POST' });

        expect(response.status).toBe(404);
      } finally {
        await app.close();
      }
    },
    BOOT_AND_REQUEST_TIMEOUT_MS,
  );

  it(
    'answers 404 when NODE_ENV=production',
    async () => {
      const app = await bootApiUnder(NodeEnvironment.Production);

      try {
        const response = await fetch(routeUrlOf(app), { method: 'POST' });

        expect(response.status).toBe(404);
      } finally {
        await app.close();
      }
    },
    BOOT_AND_REQUEST_TIMEOUT_MS,
  );
});
