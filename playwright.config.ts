import { defineConfig, devices, PlaywrightTestConfig } from '@playwright/test'

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

export const config: PlaywrightTestConfig = {
  testDir: './e2e',
  testMatch: '**/*.e2e.spec.ts',
  snapshotDir: './__snapshots__/e2e/',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI
    ? [['github'], ['html', { outputFolder: 'playwright-report/e2e', open: 'never' }]]
    : [['html', { outputFolder: 'playwright-report/e2e' }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    baseURL: 'http://localhost:3000',
  },

  ...(process.env.CI
    ? {
        webServer: {
          command: 'pnpm start',
          port: 3000,
          reuseExistingServer: true,
        },
      }
    : {}),

  expect: {
    toHaveScreenshot: {
      stylePath: './screenshot.css',
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'], isMobile: true },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'], isMobile: true },
    },
  ],
}

export default defineConfig(config)
