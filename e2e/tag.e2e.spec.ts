import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe.configure({ mode: 'parallel' })
test.describe('Tag - E2E', () => {
  test('アクセシビリティの検証', async ({ page }) => {
    await page.goto('/tags/テスト')

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('記事一覧からタグページへの遷移', async ({ page }) => {
    // 「テスト」をURLエンコードした文字列
    const encodedTestTag = encodeURIComponent('テスト')

    // トップページにアクセス
    await page.goto('/')

    // 「テスト」タグをクリック
    await page.getByRole('link', { name: 'テスト', exact: true }).first().click()

    // ページ遷移を待機
    await page.waitForURL(`/tags/${encodedTestTag}`)

    // タグページのタイトルが正しいことを確認
    await expect(page.locator('h1')).toContainText('#テスト')

    // タグページに記事のリストが表示されていることを確認
    expect(await page.locator('article').count()).toBe(3)
  })

  test('記事詳細ページからタグページへの遷移', async ({ page }) => {
    // 「タグ機能」をURLエンコードした文字列
    const encodedTagFunctionTag = encodeURIComponent('タグ機能')

    // 記事詳細ページにアクセス
    await page.goto('/posts/2099/01/03_tag-test')

    // 「タグ機能」タグをクリック
    await page.getByRole('link', { name: 'タグ機能', exact: true }).first().click()

    // ページ遷移を待機
    await page.waitForURL(`/tags/${encodedTagFunctionTag}`)

    // タグページのタイトルが正しいことを確認
    await expect(page.locator('h1')).toContainText('#タグ機能')

    // タグページに記事のリストが表示されていることを確認
    expect(await page.locator('article').count()).toBe(1)
  })

  test('タグページから記事へのナビゲーション', async ({ page }) => {
    // 「テスト」タグページにアクセス
    await page.goto('/tags/テスト')

    // 表示された記事のタイトルをクリック
    await page.getByRole('link', { name: 'タグテスト用ページ' }).click()

    // 記事詳細ページに遷移したことを確認
    await expect(page).toHaveURL('/posts/2099/01/03_tag-test')
  })

  test('複数のタグを持つ記事の表示', async ({ page }) => {
    // 「タグ機能」をURLエンコードした文字列
    const encodedTagFunctionTag = encodeURIComponent('タグ機能')
    // 「プログラミング」タグページにアクセス
    await page.goto('/tags/プログラミング')

    // 「タグテスト用ページ」が表示されていることを確認
    await expect(page.getByRole('link', { name: 'タグテスト用ページ' })).toBeVisible()

    // 「タグ機能」タグをクリック
    await page.getByRole('link', { name: 'タグ機能' }).click()

    // ページ遷移を待機
    await page.waitForURL(`/tags/${encodedTagFunctionTag}`)
  })
})
