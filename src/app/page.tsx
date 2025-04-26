import { getAllPosts } from '@/lib/content'
import { PostList } from '@/components/PostList/PostList'
import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Tech Blog - 技術的な学びを共有するブログ',
  description: 'Webフロントエンドやアクセシビリティに関する技術的な学びを共有するブログです',
}

export default function Home() {
  const posts = getAllPosts()

  return (
    <div className="max-w-4xl mx-auto">
      {/* TODO：内容を修正 */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Tech Blog",
            "description": "Webフロントエンドやアクセシビリティに関する技術的な学びを共有するブログです",
            "url": "https://tech-blog.example.com",
          })
        }}
      />
      <div className="mb-8 text-center">
        {/* TODO：内容を修正 */}
        <h1 className="text-4xl font-bold mb-4">Tech Blog</h1>
        <p className="text-xl text-gray-700">
          Webフロントエンドやアクセシビリティに関する技術的な学びを共有するブログです
        </p>
      </div>
      <PostList posts={posts} />
    </div>
  )
}
