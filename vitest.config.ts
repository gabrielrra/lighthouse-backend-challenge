
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globalSetup: './src/tests/setup.ts',
    env: {
      DB_URL: process.env.DB_URL!
    },
    fileParallelism: false
  }
});
