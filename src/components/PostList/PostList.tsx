import Link from 'next/link'
import type { PostMeta } from '@/lib/content'

type PostListProps = {
  posts: PostMeta[]
}

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="py-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">記事はまだありません</h2>
        <p className="text-gray-600">
          これからWebフロントエンドやアクセシビリティに関する記事を投稿していきます。
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {posts.map((post) => (
        <article key={`${post.year}-${post.month}-${post.slug}`} className="border-b border-gray-200 pb-8 last:border-0">
          <Link 
            href={`/posts/${post.year}/${post.month}/${post.slug}`}
            className="group block"
          >
            <h2 className="text-2xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
              {post.title}
            </h2>
          </Link>
          
          <div className="flex flex-wrap items-center text-sm text-gray-600 mb-3 gap-x-4">
            <time dateTime={post.date} className="flex items-center">
              <span className="mr-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
              {new Date(post.date).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
          
          <p className="text-gray-700 mb-4">
            {post.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <div className="mt-4">
            <Link 
              href={`/posts/${post.year}/${post.month}/${post.slug}`}
              className="text-blue-600 hover:underline inline-flex items-center text-sm"
            >
              記事を読む
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </article>
      ))}
    </div>
  )
} 