/**
 * Every HTTP route of the API is served under `/api` (`CLAUDE.md` §3).
 *
 * Extracted out of `main.ts` so it can be reused by anything that needs to
 * boot `AppModule` outside the real process bootstrap — today, the Jest
 * integration test that proves the `T-C10-73` test-harness route exists only
 * under `NODE_ENV=test`
 * (`../testing/test-event-dispatch.harness-gating.spec.ts`). Importing
 * `main.ts` itself is not an option there: its module body calls
 * `bootstrap()` unconditionally as a side effect, which would start a second,
 * uncontrolled server.
 */
export const GLOBAL_PREFIX = 'api';

/**
 * The routes that must stay *outside* the `/api` prefix.
 *
 * These are the container liveness and readiness probes. The endpoints
 * themselves are deliberately not implemented here — observability
 * (`@nestjs/terminus`, `nestjs-pino`, Swagger) is the standalone slice
 * `T-C10-28`. What this reserves is the exemption list itself, so that adding
 * the probes later is a pure addition and never a change to the prefix
 * contract.
 *
 * Note on syntax: NestJS 11 runs on Express 5 and compiles each entry with
 * `path-to-regexp@8`, where the Express 4 wildcard forms are no longer valid.
 * These are literal paths, which that grammar matches exactly.
 */
export const GLOBAL_PREFIX_EXCLUSIONS = ['/health/live', '/health/ready'];
