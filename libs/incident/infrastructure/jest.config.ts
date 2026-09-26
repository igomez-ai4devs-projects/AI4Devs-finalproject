export default {
  displayName: 'incident-infrastructure',
  // `passWithNoTests` removed (T-C1-06): this ticket brings the first specs
  // (`incident.mapper.spec.ts`, `typeorm-incident.repository.spec.ts`), so an
  // empty run is no longer expected and should fail loudly if it happens.
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  // The round-trip-against-real-PostgreSQL spec lives in the separate
  // `integration` target (`jest.integration.config.ts`), never in this
  // Nx-inferred `test` target, so `pnpm nx run-many -t test` (CI's `verify`
  // job, no database) stays green (T-C1-06 Trap 7). Naming already keeps
  // `*.integration-spec.ts` outside the Nx jest preset's own `testMatch`
  // (`**/?(*.)+(spec|test).[jt]s`, which requires the suffix to be exactly
  // `.spec.ts`/`.test.ts` — `-spec.ts` does not qualify); this ignore pattern
  // makes the separation explicit rather than relying on that alone.
  testPathIgnorePatterns: ['/node_modules/', '\\.integration-spec\\.ts$'],
  coverageDirectory: '../../../coverage/libs/incident/infrastructure',
};
