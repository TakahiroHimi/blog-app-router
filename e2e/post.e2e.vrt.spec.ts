import { test, expect } from '@playwright/test'

test.describe('Post - VRT', () => {
  test('マークダウンテストページ', async ({ page, viewport }) => {
    await page.goto('http://localhost:3000/posts/2099/01/01_markdown-test')

    if (!viewport) {
      throw new Error('Viewport is not defined')
    }

    await expect(page).toHaveScreenshot({ fullPage: true })
  })

  test('カスタムコンポーネントテストページ', async ({ page, viewport }) => {
    await page.goto('http://localhost:3000/posts/2099/01/02_custom-component-test')

    if (!viewport) {
      throw new Error('Viewport is not defined')
    }

    await expect(page).toHaveScreenshot({ fullPage: true })
  })
})
