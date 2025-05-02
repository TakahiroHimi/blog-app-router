import { test, expect } from '@playwright/experimental-ct-react'
import { setupServer } from 'msw/node'
import { HttpResponse, http } from 'msw'
import { LinkCard } from './LinkCard'

const server = (html: string) =>
  setupServer(
    http.get('http://example.com', () => {
      return HttpResponse.html(html)
    }),
  )

test.describe('表示が正しいこと', () => {
  test('全ての要素がある場合', async ({ mount, page }) => {
    const html = `
        <html>
          <head>
            <title>サンプルページ</title>
            <meta property="og:title" content="OGタイトル">
            <meta property="og:description" content="これはサンプルページの説明です。リンクカードのテスト用に作成されました。">
            <meta property="og:image" content="http://localhost:3000/logo.png">
            <meta property="og:site_name" content="サンプルサイト">
            <link rel="icon" href="http://localhost:3000/logo.png">
          </head>
          <body>
            <h1>サンプルコンテンツ</h1>
          </body>
        </html>
        `
    server(html).listen()
    const component = await mount(await LinkCard({ url: 'http://example.com' }))

    await expect(component).toHaveScreenshot()

    // urlへのリンク要素であること
    await expect(
      page.getByRole('link', {
        name: 'OGタイトル これはサンプルページの説明です。リンクカードのテスト用に作成されました。 サンプルサイト',
      }),
    ).toBeVisible()
    await expect(component).toHaveAttribute('href', 'http://example.com')

    server(html).close()
  })
})
