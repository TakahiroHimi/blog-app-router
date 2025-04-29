import { getAllPostsMeta } from '@/lib/content'
import { PostList } from '@/components/PostList/PostList'
import Script from 'next/script'

export default function Home() {
  // すべての記事を取得
  const allPosts = getAllPostsMeta()

  return (
    <div className="max-w-4xl mx-auto">
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'himi.blog',
            description: 'himi.blog',
            url: 'https://himi.blog',
            image: {
              '@type': 'ImageObject',
              url: 'https://himi.blog/logo.png',
            },
          }),
        }}
      />
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">himi.blog</h1>
      </div>
      <PostList posts={allPosts} />
    </div>
  )
}
