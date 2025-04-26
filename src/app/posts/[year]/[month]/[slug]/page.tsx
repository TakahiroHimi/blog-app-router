import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug, getRecentPosts } from '@/lib/content'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import type { Metadata } from 'next'
import rehypePrettyCode from 'rehype-pretty-code'
import Script from 'next/script'

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
  
  const url = `https://tech-blog.example.com/posts/${year}/${month}/${slug}`

  // TODO：内容を修正
  const ogImageUrl = new URL(`/api/og/post`, 'https://tech-blog.example.com')
  
  // OG画像のURLパラメータを設定
  ogImageUrl.searchParams.append('title', post.meta.title)
  ogImageUrl.searchParams.append('date', post.meta.date)
  
  // TODO：内容を修正
  return {
    title: `${post.meta.title} | Tech Blog`,
    description: post.meta.description,
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      type: 'article',
      publishedTime: post.meta.date,
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
      description: post.meta.description,
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
  
  const { meta, content } = post
  const recentPosts = getRecentPosts(3).filter(p => 
    !(p.year === year && p.month === month && p.slug === slug)
  )
  
  const postUrl = `https://tech-blog.example.com/posts/${year}/${month}/${slug}`

  return (
    <div className="max-w-3xl mx-auto">
      {/* TODO：内容を修正 */}
      <Script
        id="article-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": meta.title,
            "description": meta.description,
            "datePublished": meta.date,
            "author": {
              "@type": "Person",
              "name": "Tech Blog Author"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Tech Blog",
              "logo": {
                "@type": "ImageObject",
                "url": "https://tech-blog.example.com/logo.png"
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
            <time dateTime={meta.date} className="flex items-center">
              <span className="mr-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
              {new Date(meta.date).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
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
          
          <p className="text-lg text-gray-600">
            {meta.description}
          </p>
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
          />
        </div>
      </article>
      
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
                  <time dateTime={post.date} className="text-xs text-gray-500">
                    {new Date(post.date).toLocaleDateString('ja-JP')}
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