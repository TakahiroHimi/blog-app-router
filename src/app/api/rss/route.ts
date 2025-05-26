import { getAllPostsMeta } from '@/lib/content'
import { NextResponse } from 'next/server'
import { BASE_URL } from '@/lib/constants'

export async function GET(request: Request) {
  const posts = getAllPostsMeta()

  // 実際のリクエスト URL を取得
  const requestUrl = new URL(request.url)
  const fullRequestUrl = `${BASE_URL}${requestUrl.pathname}`

  // RSSフィードのXMLを構築
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>blog.himi.dev</title>
    <link>${BASE_URL}</link>
    <description>blog.himi.dev</description>
    <language>ja</language>
    <pubDate>${new Date(posts[0].createdAt).toUTCString()}</pubDate>
    <ttl>10</ttl>
    <image>
      <url>${BASE_URL}/logo.png</url>
      <title>blog.himi.dev</title>
      <link>${BASE_URL}</link>
    </image>
    <generator>blog.himi.dev RSS Generator</generator>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${fullRequestUrl}" rel="self" type="application/rss+xml" />
    ${posts
      .slice(0, 20) // 最新20件の記事を表示
      .map((post) => {
        const url = `${BASE_URL}/posts/${post.year}/${post.month}/${post.slug}`
        const pubDate = new Date(post.createdAt).toUTCString()
        // 更新日があれば設定
        const updatedDate = post.updatedAt ? new Date(post.updatedAt).toUTCString() : null
        const description = post.description

        return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}${updatedDate ? `?updated=${encodeURIComponent(updatedDate)}` : ''}</guid>
      <description><![CDATA[${description}]]></description>
      <pubDate>${new Date(pubDate).toUTCString()}</pubDate>
      ${updatedDate && !pubDate ? `<dc:date>${updatedDate}</dc:date>` : ''}
      ${post.tags.map((tag) => `<category>${tag}</category>`).join('')}
    </item>`
      })
      .join('')}
  </channel>
</rss>`

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
