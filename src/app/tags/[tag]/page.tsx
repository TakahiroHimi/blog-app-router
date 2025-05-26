import { getAllPostsMeta, getPostsByTag } from '@/lib/content'
import { PostList } from '@/components/PostList/PostList'
import Link from 'next/link'
import { Metadata } from 'next'

type PageParams = Promise<{
  tag: string
}>

export const generateStaticParams = async () => {
  const posts = getAllPostsMeta()
  return posts
    .flatMap((post) => post.tags)
    .map((tag) => ({
      tag,
    }))
}

// メタデータを動的に生成
export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const paramsData = await params
  const decodedTag = decodeURIComponent(paramsData.tag)

  return {
    title: `${decodedTag}に関する記事 | blog.himi.dev`,
    description: `${decodedTag}タグが付いた記事の一覧です。`,
    openGraph: {
      title: `${decodedTag}に関する記事 | blog.himi.dev`,
      description: `${decodedTag}タグが付いた記事の一覧です。`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${decodedTag}に関する記事 | blog.himi.dev`,
      description: `${decodedTag}タグが付いた記事の一覧です。`,
    },
  }
}

export default async function TagPage({ params }: { params: PageParams }) {
  const paramsData = await params
  const decodedTag = decodeURIComponent(paramsData.tag)

  // 指定したタグを持つ記事を取得
  const filteredPosts = getPostsByTag(decodedTag)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-center">#{decodedTag}</h1>
        <p className="text-center text-gray-600 mb-4">このタグが付いた記事: {filteredPosts.length}件</p>
        <div className="text-center">
          <Link href="/" className="text-blue-600 hover:underline inline-flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            記事一覧に戻る
          </Link>
        </div>
      </div>
      <PostList posts={filteredPosts} />
    </div>
  )
}
