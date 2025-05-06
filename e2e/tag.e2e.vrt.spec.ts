import { test, expect } from '@playwright/test'

test.describe('Tag - VRT', () => {
  test('タグ「テスト」ページ', async ({ page }) => {
    await page.goto('http://localhost:3000/tags/テスト')

    await expect(page).toHaveScreenshot({ fullPage: true })
  })
})
