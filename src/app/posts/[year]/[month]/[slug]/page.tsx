import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug, getRecentPosts } from '@/lib/content'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import type { Metadata } from 'next'
import rehypePrettyCode from 'rehype-pretty-code'
import Script from 'next/script'
import { LinkCard } from '@/components/LinkCard/LinkCard'
import { CopyUrlButton } from '@/components/CopyUrlButton/CopyUrlButton'

const components = {
  // カード用のカスタムコンポーネント
  LinkCard: ({ children }: { children: { props: { children: string } } }) => {

    const url = children.props.children.trim();

    // childrenが文字列でURLの場合
    if (typeof url === 'string' && url.trim().startsWith('http')) {
      return <LinkCard url={url} />;
    }
    // それ以外の場合はそのまま表示
    return <div className="border p-4 rounded-md">{url}</div>;
  }
}

type PageParams = {
  params: {
    year: string
    month: string
    slug: string
  }
}

// 静的ページの生成に必要なパラメータを提供
export async function generateStaticParams() {
  const posts = getAllPosts()
  
  return posts.map((post) => ({
    year: post.year,
    month: post.month,
    slug: post.slug,
  }))
}

// メタデータを動的に生成
export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const paramsData = await Promise.resolve(params)
  const year = paramsData.year
  const month = paramsData.month
  const slug = paramsData.slug
  
  const post = getPostBySlug(year, month, slug)
  
  if (!post) {
    return {
      title: '記事が見つかりません',
      description: '指定された記事は存在しないか、削除された可能性があります。',
    }
  }
  
  const url = `https://himi.blog/posts/${year}/${month}/${slug}`

  const ogImageUrl = new URL(`/api/og/post`, 'https://himi.blog')
  
  // OG画像のURLパラメータを設定
  ogImageUrl.searchParams.append('title', post.meta.title)
  
  // 更新日がない場合は作成日を使用
  const updatedAt = post.meta.updatedAt || post.meta.createdAt
  
  return {
    title: `${post.meta.title} | himi.blog`,
    description: post.description,
    openGraph: {
      title: post.meta.title,
      description: post.description,
      type: 'article',
      publishedTime: post.meta.createdAt,
      modifiedTime: updatedAt,
      url,
      tags: post.meta.tags,
      images: [
        {
          url: ogImageUrl.toString(),
          width: 1200,
          height: 630,
          alt: post.meta.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta.title,
      description: post.description,
      images: [ogImageUrl.toString()],
    },
    alternates: {
      canonical: url,
    },
  }
}

// 記事詳細ページ
export default async function PostPage({ params }: PageParams) {
  const paramsData = await Promise.resolve(params)
  const year = paramsData.year
  const month = paramsData.month
  const slug = paramsData.slug
  
  const post = getPostBySlug(year, month, slug)
  
  if (!post) {
    notFound()
  }
  
  const { meta, content, description } = post
  const recentPosts = getRecentPosts(3).filter(p => 
    !(p.year === year && p.month === month && p.slug === slug)
  )
  
  const postUrl = `https://himi.blog/posts/${year}/${month}/${slug}`

  // 更新日がない場合は作成日を使用
  const updatedAt = meta.updatedAt || meta.createdAt
  
  // 作成日と更新日が異なる場合は更新日も表示
  const showUpdatedDate = updatedAt !== meta.createdAt

  return (
    <div className="max-w-4xl mx-auto">
      <Script
        id="article-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": meta.title,
            "description": description,
            "datePublished": meta.createdAt,
            "dateModified": updatedAt,
            "author": {
              "@type": "Person",
              "name": "himi.blog Author"
            },
            "publisher": {
              "@type": "Organization",
              "name": "himi.blog",
              "logo": {
                "@type": "ImageObject",
                "url": "https://himi.blog/logo.png"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": postUrl
            },
            "keywords": meta.tags.join(", ")
          })
        }}
      />
      <article className="prose prose-lg prose-headings:font-semibold prose-a:text-blue-600 max-w-none">
        <header className="not-prose mb-8">
          <h1 className="text-3xl font-bold mb-3">{meta.title}</h1>
          <div className="flex flex-wrap items-center text-sm text-gray-600 mb-3 gap-x-4">
            <time dateTime={meta.createdAt} className="flex items-center">
              <span className="mr-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
              <span className="mr-1">投稿日:</span>
              {new Date(meta.createdAt).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            
            {showUpdatedDate && (
              <time dateTime={updatedAt} className="flex items-center">
                <span className="mr-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </span>
                <span className="mr-1">更新日:</span>
                {new Date(updatedAt).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {meta.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>
        
        <div className="prose prose-lg prose-headings:font-semibold prose-a:text-blue-600 max-w-none">
          <MDXRemote 
            source={content} 
            options={{
              mdxOptions: {
                rehypePlugins: [
                  [rehypePrettyCode, { theme: 'dark-plus' }]
                ]
              }
            }}
            components={components}
          />
        </div>
      </article>
      
      <div className="my-8 flex justify-center space-x-4">
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(`${meta.title} @himi_himi_`)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Xでシェア"
          title="Xでシェア"
          className="inline-flex items-center justify-center p-3 border border-gray-300 rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
        
        <CopyUrlButton url={postUrl} />
      </div>
      
      {recentPosts.length > 0 && (
        <div className="border-t border-gray-200 pt-8 mt-10">
          <h2 className="text-2xl font-semibold mb-4">他の記事も読む</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <div key={`${post.year}-${post.month}-${post.slug}`} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <Link 
                  href={`/posts/${post.year}/${post.month}/${post.slug}`} 
                  className="block"
                >
                  <h3 className="font-medium mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {post.description}
                  </p>
                  <time dateTime={post.createdAt} className="text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString('ja-JP')}
                  </time>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-8 text-center">
        <Link href="/" className="text-blue-600 hover:underline inline-flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          記事一覧に戻る
        </Link>
      </div>
    </div>
  )
} 