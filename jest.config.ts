import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/src/tests/**/*.test.ts'],
  setupFiles: ['<rootDir>/src/tests/setupEnv.ts'],
  clearMocks: true
};

export default config;
