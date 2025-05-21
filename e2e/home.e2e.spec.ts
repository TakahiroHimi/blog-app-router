import AxeBuilder from '@axe-core/playwright'
import { test, expect } from '@playwright/test'

test.describe.configure({ mode: 'parallel' })

test.describe('Home - E2E', () => {
  test('ページ遷移を検証', async ({ page }) => {
    await page.goto('/')

    // 記事ページに遷移できる
    await page.getByRole('link', { name: 'マークダウンテスト用ページ' }).click()
    await expect(page).toHaveURL('/posts/2099/01/01_markdown-test')

    // ヘッダーのリンクをクリックしてトップページに遷移できる
    await page.getByRole('banner').getByRole('link', { name: 'himi.blog' }).click()
    await expect(page).toHaveURL('/')

    // カスタムコンポーネントテスト用ページに遷移できる
    await page.getByRole('link', { name: 'カスタムコンポーネントテスト用ページ' }).click()
    await expect(page).toHaveURL('/posts/2099/01/02_custom-component-test')

    // フッターのリンクをクリックしてトップページに遷移できる
    await page.getByRole('contentinfo').getByRole('link', { name: 'himi.blog' }).click()
    await expect(page).toHaveURL('/')
  })

  test('アクセシビリティを検証', async ({ page }) => {
    await page.goto('/')

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    expect(accessibilityScanResults.violations).toEqual([])
  })
})
