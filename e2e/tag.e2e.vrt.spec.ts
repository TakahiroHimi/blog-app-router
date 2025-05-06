import { test, expect } from '@playwright/test'

test.describe('Tag - VRT', () => {
  test('タグ「テスト」ページ', async ({ page, viewport }) => {
    await page.goto('/tags/テスト')

    if (!viewport) {
      throw new Error('Viewport is not defined')
    }

    await page.setViewportSize({ width: viewport.width, height: 4000 })
    await expect(page).toHaveScreenshot()
  })

  test('タグ「マークダウン」ページ', async ({ page, viewport }) => {
    await page.goto('/tags/マークダウン')

    if (!viewport) {
      throw new Error('Viewport is not defined')
    }

    await page.setViewportSize({ width: viewport.width, height: 4000 })
    await expect(page).toHaveScreenshot()
  })

  test('タグ「カスタムコンポーネント」ページ', async ({ page, viewport }) => {
    await page.goto('/tags/カスタムコンポーネント')

    if (!viewport) {
      throw new Error('Viewport is not defined')
    }

    await page.setViewportSize({ width: viewport.width, height: 4000 })
    await expect(page).toHaveScreenshot()
  })

  test('タグ「タグ機能」ページ', async ({ page, viewport }) => {
    await page.goto('/tags/タグ機能')

    if (!viewport) {
      throw new Error('Viewport is not defined')
    }

    await page.setViewportSize({ width: viewport.width, height: 4000 })
    await expect(page).toHaveScreenshot()
  })

  test('タグ「プログラミング」ページ', async ({ page, viewport }) => {
    await page.goto('/tags/プログラミング')

    if (!viewport) {
      throw new Error('Viewport is not defined')
    }

    await page.setViewportSize({ width: viewport.width, height: 4000 })
    await expect(page).toHaveScreenshot()
  })
})
