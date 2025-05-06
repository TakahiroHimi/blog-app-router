import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Post - E2E', () => {
  test('トップページ', async ({ page }) => {
    await page.goto('/')

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('マークダウンテストページ', async ({ page }) => {
    await page.goto('/posts/2099/01/01_markdown-test')

    const accessibilityScanResults = await new AxeBuilder({ page }).exclude('input[type="checkbox"]').analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('カスタムコンポーネントテストページ', async ({ page }) => {
    await page.goto('/posts/2099/01/02_custom-component-test')

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })
})
