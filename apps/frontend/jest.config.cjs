module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  setupFiles: ['<rootDir>/src/test-polyfills.cjs'],
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  moduleNameMapper: {
    '^@ckpharmacy/shared$': '<rootDir>/../../packages/shared/src/index.ts',
    '\\.(css)$': '<rootDir>/src/style-mock.cjs',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.app.json' }],
  },
};
