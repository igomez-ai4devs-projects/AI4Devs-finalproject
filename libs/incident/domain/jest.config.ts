export default {
  displayName: 'incident-domain',
  // Scaffolded empty (T-C1-01); remove once the first spec lands (T-C1-03).
  passWithNoTests: true,
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../coverage/libs/incident/domain',
};
