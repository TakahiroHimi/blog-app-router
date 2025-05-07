import { test, expect } from '@playwright/test'

test.describe.configure({ mode: 'parallel' })
test.describe('Tag - VRT', () => {
  test('タグ「テスト」ページ', async ({ page }) => {
    await page.goto('/tags/テスト')

    await expect(page).toHaveScreenshot({ fullPage: true })
  })
})
