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

// normal data
const normalTitle = 'サンプルページタイトル'
const normalDescription = 'これはサンプルページの説明です。'
const normalOgImage = 'http://localhost:3000/fixture/LinkCard/normalOgImage.png'
const normalSiteName = 'サンプルサイトネーム'

// irregular data
const longTitle = 'サンプルページタイトル'.repeat(10)
const longDescription = 'これはサンプルページの説明です。'.repeat(10)
const squareOgImage = 'http://localhost:3000/fixture/LinkCard/squareOgImage.png'
const longSiteName = 'サンプルサイトネーム'.repeat(10)

const sampleHtml = (
  title: string = normalTitle,
  description: string = normalDescription,
  image: string = normalOgImage,
  siteName: string = normalSiteName,
) => `
        <html>
          <head>
            <title>${title}</title>
            <meta property="og:title" content="${title}">
            <meta property="og:description" content="${description}">
            <meta property="og:image" content="${image}">
            <meta property="og:site_name" content="${siteName}">
            <link rel="icon" href="http://localhost:3000/logo.png">
          </head>
          <body>
            <h1>サンプルコンテンツ</h1>
          </body>
        </html>
        `

test.describe('VRT', () => {
  test.describe('全ての要素がある場合', () => {
    test('normal data', async ({ mount }) => {
      const html = sampleHtml()
      server(html).listen()

      const component = await mount(await LinkCard({ url: 'https://nextjs.org/' }))

      await expect(component).toHaveScreenshot()

      server(html).close()
    })
    test('irregular data', async ({ mount }) => {
      const html = sampleHtml(longTitle, longDescription, squareOgImage, longSiteName)
      server(html).listen()

      const component = await mount(await LinkCard({ url: 'http://example.com' }))

      await expect(component).toHaveScreenshot()

      server(html).close()
    })
  })

  test.describe('要素が不足している場合', () => {
    test('titleがない場合', async ({ mount }) => {
      const html = sampleHtml(undefined, normalDescription, normalOgImage, normalSiteName)
      server(html).listen()

      const component = await mount(await LinkCard({ url: 'http://example.com' }))

      await expect(component).toHaveScreenshot()

      server(html).close()
    })
    test('descriptionがない場合', async ({ mount }) => {
      const html = sampleHtml(normalTitle, undefined, normalOgImage, normalSiteName)
      server(html).listen()

      const component = await mount(await LinkCard({ url: 'http://example.com' }))

      await expect(component).toHaveScreenshot()

      server(html).close()
    })
    test('og:imageがない場合', async ({ mount }) => {
      const html = sampleHtml(normalTitle, normalDescription, undefined, normalSiteName)
      server(html).listen()

      const component = await mount(await LinkCard({ url: 'http://example.com' }))

      await expect(component).toHaveScreenshot()

      server(html).close()
    })
    test('og:site_nameがない場合', async ({ mount }) => {
      const html = sampleHtml(normalTitle, normalDescription, normalOgImage, undefined)
      server(html).listen()

      const component = await mount(await LinkCard({ url: 'http://example.com' }))

      await expect(component).toHaveScreenshot()

      server(html).close()
    })
  })
})
