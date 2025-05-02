import { test, expect } from '@playwright/test'

test.describe('Post', () => {
  test('VRT', async ({ page, viewport }) => {
    await page.goto('http://localhost:3000/posts/2099/01/01_markdown-test')

    if (!viewport) {
      throw new Error('Viewport is not defined')
    }

    await page.setViewportSize({ width: viewport.width, height: 8000 })
    await expect(page).toHaveScreenshot()
  })
})
