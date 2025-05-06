import { test, expect } from '@playwright/test'

test.describe('Post - VRT', () => {
  test('マークダウンテストページ', async ({ page, viewport }) => {
    await page.goto('/posts/2099/01/01_markdown-test')

    if (!viewport) {
      throw new Error('Viewport is not defined')
    }

    await page.setViewportSize({ width: viewport.width, height: 8000 })
    await expect(page).toHaveScreenshot()
  })

  test('カスタムコンポーネントテストページ', async ({ page, viewport }) => {
    await page.goto('/posts/2099/01/02_custom-component-test')

    if (!viewport) {
      throw new Error('Viewport is not defined')
    }

    await page.setViewportSize({ width: viewport.width, height: 8000 })
    await expect(page).toHaveScreenshot()
  })

  test.describe('OGP画像', () => {
    test('normal title', async ({ page }) => {
      await page.goto('/api/og/post?title=テストページタイトル')

      await expect(page).toHaveScreenshot()
    })

    test('long title', async ({ page }) => {
      await page.goto('/api/og/post?title=テストページタイトルテストページタイトルテストページタイトルテストページタイトル')

      await expect(page).toHaveScreenshot()
    })
  })
})
