/* eslint-disable @next/next/no-img-element */
import * as cheerio from 'cheerio'

interface LinkCardProps {
  url: string
}

async function fetchLinkData(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkCardBot/1.0; +https://example.com/bot)',
      },
      next: { revalidate: 60 * 60 * 24 }, // 1日のキャッシュ
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`)
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // メタデータの取得
    const title = $('meta[property="og:title"]').attr('content') || $('title').text() || ''

    const description =
      $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || ''

    let ogImage = $('meta[property="og:image"]').attr('content') || ''

    const siteName = $('meta[property="og:site_name"]').attr('content') || ''

    // ファビコンの取得
    let favicon =
      $('link[rel="icon"]').attr('href') ||
      $('link[rel="shortcut icon"]').attr('href') ||
      $('link[rel="apple-touch-icon"]').attr('href') ||
      '/favicon.ico'

    // ベースURLの取得
    const baseUrl = new URL(url)

    // ogImageのURLを絶対URLに変換
    if (ogImage && !ogImage.startsWith('http')) {
      try {
        ogImage = ogImage.startsWith('/')
          ? `${baseUrl.protocol}//${baseUrl.host}${ogImage}`
          : `${baseUrl.protocol}//${baseUrl.host}/${ogImage}`
      } catch (error) {
        console.error('Error parsing ogImage URL:', error)
        ogImage = ''
      }
    }

    // ファビコンのURLを絶対URLに変換
    if (favicon && !favicon.startsWith('http')) {
      try {
        favicon = favicon.startsWith('/')
          ? `${baseUrl.protocol}//${baseUrl.host}${favicon}`
          : `${baseUrl.protocol}//${baseUrl.host}/${favicon}`
      } catch (error) {
        console.error('Error parsing favicon URL:', error)
        favicon = ''
      }
    }

    return {
      title,
      description,
      ogImage,
      favicon,
      siteName,
      url,
    }
  } catch (error) {
    console.error('Error fetching link data:', error)
    return {
      title: url,
      description: '',
      ogImage: '',
      favicon: '',
      siteName: '',
      url,
    }
  }
}

export async function LinkCard({ url }: LinkCardProps) {
  const linkData = await fetchLinkData(url)
  const { title, description, ogImage, favicon, siteName } = linkData

  // URLからホスト名を抽出
  const hostname = new URL(url).hostname
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="not-prose block no-underline mb-6 border border-gray-200 rounded-md overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="flex flex-row">
        {ogImage && (
          <div className="w-1/3 max-h-24 md:max-h-36 relative">
            <img src={ogImage} alt="" className="object-cover w-full h-full" />
          </div>
        )}
        <div className="p-3 md:p-4 flex-1 flex flex-col justify-between">
          <div>
            <p className="text-sm md:text-lg font-medium text-gray-900 line-clamp-1 mb-1 md:mb-2">{title}</p>
            {description && (
              <p className="text-xs md:text-sm text-gray-600 line-clamp-1 md:line-clamp-2 mb-1 md:mb-3">{description}</p>
            )}
          </div>
          <div className="flex items-center mt-1 md:mt-2">
            {favicon && (
              <div className="mr-2 w-3 h-3 md:w-4 md:h-4">
                <img src={favicon} alt="" className="w-3 h-3 md:w-4 md:h-4 object-contain" />
              </div>
            )}
            <span className="text-xs text-gray-500">aaa{siteName || hostname}</span>
          </div>
        </div>
      </div>
    </a>
  )
}
