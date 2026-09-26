/**
 * The database-backed counterpart to `jest.config.ts` (T-C1-06 Trap 7). Kept
 * as a separate Jest project/config, run by its own Nx `integration` target
 * — never by the Nx-inferred `test` target — because `pnpm nx run-many -t
 * lint test build` (CI's `verify` job) runs with no PostgreSQL available; a
 * spec here needs the ephemeral e2e database (`docker/docker-compose.e2e.yml`,
 * host port 5499) up and migrated first, exactly as `apps/api-e2e` already
 * requires for its own suite. See `project.json`'s `integration-db-up` /
 * `integration-migrate` / `integration` targets.
 */
export default {
  displayName: 'incident-infrastructure-integration',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      { tsconfig: '<rootDir>/tsconfig.integration.json' },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  testMatch: ['**/*.integration-spec.ts'],
  coverageDirectory:
    '../../../coverage/libs/incident/infrastructure-integration',
};
