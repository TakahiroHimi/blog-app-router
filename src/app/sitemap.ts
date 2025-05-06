import { MetadataRoute } from 'next'
import { getAllPostsMeta } from '@/lib/content'
import { BASE_URL } from '@/lib/constants'

const POSTS_PER_SITEMAP = 100 // 1サイトマップあたりの記事数

// サイトマップIDを生成
export async function generateSitemaps() {
  const posts = getAllPostsMeta()
  const totalSitemaps = Math.ceil(posts.length / POSTS_PER_SITEMAP)

  // IDが0のサイトマップは固定ページ用
  const sitemaps = [{ id: 0 }]

  // 記事用のサイトマップID
  for (let i = 1; i <= totalSitemaps; i++) {
    sitemaps.push({ id: i })
  }

  return sitemaps
}

// サイトマップの生成
export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const posts = getAllPostsMeta()

  // ID 0は固定ページ用
  if (id === 0) {
    return [
      {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 1.0,
      },
      // 必要に応じて他の固定ページを追加
    ]
  }

  // 記事用のサイトマップ
  const start = (id - 1) * POSTS_PER_SITEMAP
  const end = start + POSTS_PER_SITEMAP
  const sitePosts = posts.slice(start, end)

  return sitePosts.map((post) => {
    // 更新日がない場合は作成日を使用
    const lastModifiedDate = post.updatedAt || post.createdAt

    return {
      url: `${BASE_URL}/posts/${post.year}/${post.month}/${post.slug}`,
      lastModified: new Date(lastModifiedDate),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }
  })
}
