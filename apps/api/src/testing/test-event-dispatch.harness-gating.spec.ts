import type { INestApplication } from '@nestjs/common';
import { GLOBAL_PREFIX } from '../app/global-prefix';
import { NodeEnvironment } from '../config/env.validation';

const HARNESS_PORT = 3395;
const ROUTE_PATH = '/test-harness/events/dispatch-with-failing-subscriber';
const ROUTE_URL = `http://localhost:${HARNESS_PORT}/${GLOBAL_PREFIX}${ROUTE_PATH}`;

/**
 * A minimal, valid environment for booting `AppModule` in this suite. No
 * database is ever contacted: this ticket adds no TypeORM wiring, so these
 * `POSTGRES_*` values only need to satisfy `env.validation.ts`.
 */
const BASE_ENVIRONMENT = {
  PORT: String(HARNESS_PORT),
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
    await app.listen(HARNESS_PORT);
  });

  return app;
}

describe('event-dispatch test harness route gating (Trap 3)', () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = originalEnv;
  });

  it('exists and proves subscriber isolation over HTTP when NODE_ENV=test', async () => {
    const app = await bootApiUnder(NodeEnvironment.Test);

    try {
      const response = await fetch(ROUTE_URL, { method: 'POST' });

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
  });

  it('answers 404 when NODE_ENV=development', async () => {
    const app = await bootApiUnder(NodeEnvironment.Development);

    try {
      const response = await fetch(ROUTE_URL, { method: 'POST' });

      expect(response.status).toBe(404);
    } finally {
      await app.close();
    }
  });

  it('answers 404 when NODE_ENV=production', async () => {
    const app = await bootApiUnder(NodeEnvironment.Production);

    try {
      const response = await fetch(ROUTE_URL, { method: 'POST' });

      expect(response.status).toBe(404);
    } finally {
      await app.close();
    }
  });
});
