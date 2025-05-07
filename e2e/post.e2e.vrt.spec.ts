import { test, expect } from '@playwright/test'

test.describe.configure({ mode: 'parallel' })
test.describe('Post - VRT', () => {
  test('マークダウンテストページ', async ({ page }) => {
    await page.goto('/posts/2099/01/01_markdown-test')

    await expect(page).toHaveScreenshot({ fullPage: true })
  })

  test('カスタムコンポーネントテストページ', async ({ page }) => {
    await page.goto('/posts/2099/01/02_custom-component-test')

    await expect(page).toHaveScreenshot({ fullPage: true })
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
