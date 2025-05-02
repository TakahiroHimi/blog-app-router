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

test('全ての要素がある場合', async ({ mount }) => {
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

  server(html).close()
})
