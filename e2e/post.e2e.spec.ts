import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe.configure({ mode: 'parallel' })
test.describe('Post - E2E', () => {
  test('「他の記事も読む」セクションを検証', async ({ page }) => {
    await page.goto('/posts/2099/01/01_markdown-test')

    const link1 = page.getByRole('link', {
      name: '予備のテスト用ページ 予備のテスト用ページです。一般ユーザーには表示されません。 テスト環境で「他の記事も見る」セクションの表示を一定にするために作成しています',
    })
    await expect(link1).toBeVisible()
    await expect(link1).toHaveAttribute('href', '/posts/2099/01/04_buff-test')

    const link2 = page.getByRole('link', {
      name: 'タグテスト用ページ このページはタグ機能のテストのために作成された特別なページです。一般ユーザーには表示されません。 タグ機能のテスト このページには「テスト」',
    })
    await expect(link2).toBeVisible()
    await expect(link2).toHaveAttribute('href', '/posts/2099/01/03_tag-test')

    const link3 = page.getByRole('link', {
      name: 'カスタムコンポーネントテスト用ページ このページはカスタムコンポーネントのテストのために作成された特別なページです。一般ユーザーには表示されません。',
    })
    await expect(link3).toBeVisible()
    await expect(link3).toHaveAttribute('href', '/posts/2099/01/02_custom-component-test')
  })

  test.describe('マークダウンテストページ', () => {
    test('a11yを検証', async ({ page }) => {
      await page.goto('/posts/2099/01/01_markdown-test')

      const accessibilityScanResults = await new AxeBuilder({ page }).exclude('input[type="checkbox"]').analyze()
      expect(accessibilityScanResults.violations).toEqual([])
    })
  })

  test.describe('カスタムコンポーネントテストページ', () => {
    test('a11yを検証', async ({ page }) => {
      await page.goto('/posts/2099/01/02_custom-component-test')

      const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
      expect(accessibilityScanResults.violations).toEqual([])
    })
  })
})
