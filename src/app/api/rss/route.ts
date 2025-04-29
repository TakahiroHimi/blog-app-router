import { getAllPostsMeta } from '@/lib/content'
import { NextResponse } from 'next/server'

export async function GET() {
  const posts = getAllPostsMeta()
  const baseUrl = 'https://himi.blog'
  
  // RSSフィードのXMLを構築
  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
<channel>
  <title>himi.blog</title>
  <link>${baseUrl}</link>
  <description>himi.blog</description>
  <language>ja</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${baseUrl}/api/rss" rel="self" type="application/rss+xml" />
  ${posts
    .slice(0, 20) // 最新20件の記事を表示
    .map((post) => {
      const url = `${baseUrl}/posts/${post.year}/${post.month}/${post.slug}`
      const pubDate = new Date(post.createdAt).toUTCString()
      // 更新日があれば設定
      const updatedDate = post.updatedAt ? new Date(post.updatedAt).toUTCString() : null
      const description = post.description
      
      return `
  <item>
    <title><![CDATA[${post.title}]]></title>
    <link>${url}</link>
    <guid isPermaLink="true">${url}</guid>
    <description><![CDATA[${description}]]></description>
    <pubDate>${pubDate}</pubDate>
    ${updatedDate ? `<dc:date>${updatedDate}</dc:date>` : ''}
    ${post.tags.map(tag => `<category>${tag}</category>`).join('')}
  </item>`
    })
    .join('')}
</channel>
</rss>`

  // XMLをレスポンスとして返す
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=21600',
    },
  })
} 