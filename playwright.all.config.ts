import { defineConfig } from '@playwright/test'
import { config } from './playwright.config'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  ...config,
  testMatch: ['**/*.e2e.spec.ts', '**/*.e2e.vrt.spec.ts'],
})
