import { getAllPosts } from '@/lib/content'
import { NextResponse } from 'next/server'

// TODO：内容を修正
export async function GET() {
  const posts = getAllPosts()
  const baseUrl = 'https://tech-blog.example.com'
  
  // RSSフィードのXMLを構築
  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Tech Blog</title>
  <link>${baseUrl}</link>
  <description>Webフロントエンドやアクセシビリティに関する技術的な学びを共有するブログです</description>
  <language>ja</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${baseUrl}/api/rss" rel="self" type="application/rss+xml" />
  ${posts
    .slice(0, 20) // 最新20件の記事を表示
    .map((post) => {
      const url = `${baseUrl}/posts/${post.year}/${post.month}/${post.slug}`
      const pubDate = new Date(post.date).toUTCString()
      
      return `
  <item>
    <title><![CDATA[${post.title}]]></title>
    <link>${url}</link>
    <guid isPermaLink="true">${url}</guid>
    <description><![CDATA[${post.description}]]></description>
    <pubDate>${pubDate}</pubDate>
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