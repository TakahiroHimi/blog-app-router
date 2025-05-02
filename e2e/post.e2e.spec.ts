import { test, expect } from '@playwright/test'

test.describe('Post', () => {
  test('VRT', async ({ page }) => {
    await page.goto('http://localhost:3000/posts/2099/01/01_markdown-test')

    await expect(page).toHaveScreenshot()
  })
})
