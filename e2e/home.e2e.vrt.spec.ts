import { test, expect } from '@playwright/test'

test.describe('Home - VRT', () => {
  test('OGP画像', async ({ page }) => {
    await page.goto('/api/og')

    await expect(page).toHaveScreenshot()
  })
})
