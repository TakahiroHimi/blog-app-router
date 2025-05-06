import { test, expect } from '@playwright/test'

test.describe('Tag - VRT', () => {
  test('タグ「テスト」ページ', async ({ page, viewport }) => {
    await page.goto('http://localhost:3000/tags/テスト')

    if (!viewport) {
      throw new Error('Viewport is not defined')
    }

    await expect(page).toHaveScreenshot({ fullPage: true })
  })
})
