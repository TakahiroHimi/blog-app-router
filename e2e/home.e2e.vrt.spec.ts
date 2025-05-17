import { test, expect } from '@playwright/test'

test.describe.configure({ mode: 'parallel' })

test.describe('Home - VRT', () => {
  test('OGP画像', async ({ page }) => {
    await page.goto('/api/og')

    await expect(page).toHaveScreenshot()
  })
})
