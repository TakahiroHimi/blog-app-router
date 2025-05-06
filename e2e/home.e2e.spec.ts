import { test, expect } from '@playwright/test'

test.describe('Home - VRT', () => {
  test('OGP画像', async ({ page }) => {
    await page.goto('http://localhost:3000/api/og')

    await expect(page).toHaveScreenshot()
  })
})
