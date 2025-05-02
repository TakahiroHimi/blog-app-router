import { defineConfig } from '@playwright/experimental-ct-react'
import { config } from './playwright-ct.config'

/**
 * See https://playwright.dev/docs/test-configuration.
 */

export default defineConfig({
  ...config,
  testMatch: '**/*.ct.vrt.spec.tsx',
})
