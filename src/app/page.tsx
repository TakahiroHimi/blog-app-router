import { getAllPosts, getPostBySlug } from '@/lib/content'
import { PostList } from '@/components/PostList/PostList'
import Script from 'next/script'

export default function Home() {
  // すべての記事を取得
  const posts = getAllPosts()
  
  // 各記事に記事の冒頭から自動生成した説明文を追加
  const postsWithDescription = posts.map(post => {
    const fullPost = getPostBySlug(post.year, post.month, post.slug)
    return {
      ...post,
      description: fullPost ? fullPost.description : ''
    }
  })

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
            "name": "himi.blog",
            "description": "himi.blog",
            "url": "https://himi.blog",
          })
        }}
      />
      <div className="mb-8 text-center">
        {/* TODO：内容を修正 */}
        <h1 className="text-4xl font-bold mb-4">himi.blog</h1>
      </div>
      <PostList posts={postsWithDescription} />
    </div>
  )
}
