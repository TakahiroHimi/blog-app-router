import { test, expect } from '@playwright/experimental-ct-react'
import { setupServer } from 'msw/node'
import { HttpResponse, http } from 'msw'
import { LinkCard } from './LinkCard'

const createMockServer = (html: string) => {
  return setupServer(
    http.get('http://example.linkcard.ct.vrt.com', () => {
      return HttpResponse.html(html)
    }),
  )
}

// normal data
const normalTitle = 'サンプルページタイトル'
const normalDescription = 'これはサンプルページの説明です。'
const normalOgImage = 'http://localhost:3000/fixture/LinkCard/normalOgImage.png'
const normalSiteName = 'サンプルサイトネーム'

// irregular data
const longTitle = normalTitle.repeat(20)
const longDescription = normalDescription.repeat(20)
const squareOgImage = 'http://localhost:3000/fixture/LinkCard/squareOgImage.png'
const longSiteName = normalSiteName.repeat(20)

const sampleHtml = (title?: string, description?: string, image?: string, siteName?: string) => `
        <html>
          <head>
            ${title ? `<title>${title}</title>` : ''}
            ${title ? `<meta property="og:title" content="${title}">` : ''}
            ${description ? `<meta property="og:description" content="${description}">` : ''}
            ${image ? `<meta property="og:image" content="${image}">` : ''}
            ${siteName ? `<meta property="og:site_name" content="${siteName}">` : ''}
            <link rel="icon" href="http://localhost:3000/logo.png">
          </head>
          <body>
            <h1>サンプルコンテンツ</h1>
          </body>
        </html>
        `

test.describe.configure({ mode: 'serial' })
test.describe('VRT', () => {
  let server: ReturnType<typeof createMockServer>

  test.afterEach(() => {
    if (server) {
      server.close()
    }
  })

  test.describe('全ての要素がある場合', () => {
    test('normal data', async ({ mount }) => {
      const html = sampleHtml(normalTitle, normalDescription, normalOgImage, normalSiteName)
      server = createMockServer(html)
      server.listen()

      const component = await mount(await LinkCard({ url: 'http://example.linkcard.ct.vrt.com' }))

      await expect(component).toHaveScreenshot()
    })
    test('irregular data', async ({ mount }) => {
      const html = sampleHtml(longTitle, longDescription, squareOgImage, longSiteName)
      server = createMockServer(html)
      server.listen()

      const component = await mount(await LinkCard({ url: 'http://example.linkcard.ct.vrt.com' }))

      await expect(component).toHaveScreenshot()
    })
  })

  test.describe('要素が不足している場合', () => {
    test('titleがない場合', async ({ mount }) => {
      const html = sampleHtml(undefined, normalDescription, normalOgImage, normalSiteName)
      server = createMockServer(html)
      server.listen()

      const component = await mount(await LinkCard({ url: 'http://example.linkcard.ct.vrt.com' }))

      await expect(component).toHaveScreenshot()
    })
    test('descriptionがない場合', async ({ mount }) => {
      const html = sampleHtml(normalTitle, undefined, normalOgImage, normalSiteName)
      server = createMockServer(html)
      server.listen()

      const component = await mount(await LinkCard({ url: 'http://example.linkcard.ct.vrt.com' }))

      await expect(component).toHaveScreenshot()
    })
    test('og:imageがない場合', async ({ mount }) => {
      const html = sampleHtml(normalTitle, normalDescription, undefined, normalSiteName)
      server = createMockServer(html)
      server.listen()

      const component = await mount(await LinkCard({ url: 'http://example.linkcard.ct.vrt.com' }))

      await expect(component).toHaveScreenshot()
    })
    test('og:site_nameがない場合', async ({ mount }) => {
      const html = sampleHtml(normalTitle, normalDescription, normalOgImage, undefined)
      server = createMockServer(html)
      server.listen()

      const component = await mount(await LinkCard({ url: 'http://example.linkcard.ct.vrt.com' }))

      await expect(component).toHaveScreenshot()
    })
  })
})
