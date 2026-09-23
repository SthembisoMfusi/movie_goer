import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./tests/setup/tmdb-mock.ts'],
    exclude: ['node_modules', 'frontend/**'],
    testTimeout: 15000,
  },
});