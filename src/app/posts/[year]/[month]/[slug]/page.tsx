import { notFound } from 'next/navigation'
import { getAllPostsMeta, getPost } from '@/lib/content'
import Link from 'next/link'
import type { Metadata } from 'next'
import Script from 'next/script'
import { CopyUrlButton } from '@/components/CopyUrlButton/CopyUrlButton'
import { compile, run } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import { LinkCard } from '@/components/LinkCard/LinkCard'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'

type PageParams = Promise<{
  year: string
  month: string
  slug: string
}>

const components = {
  LinkCard: ({ children }: { children: { props: { children: string } } }) => {
    const url = children.props.children.trim()

    // childrenが文字列でURLの場合
    if (typeof url === 'string' && url.trim().startsWith('http')) {
      return <LinkCard url={url} />
    }
    // それ以外の場合はそのまま表示
    return <div className="border p-4 rounded-md">{url}</div>
  },
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    if (props.id === 'footnote-label') {
      return (
        <>
          <hr />
          <section {...props}>
            <span className="font-bold text-xl text-gray-600">脚注</span>
          </section>
        </>
      )
    }
    return <h2 {...props} />
  },
}

// 静的ページの生成に必要なパラメータを提供
export async function generateStaticParams() {
  const posts = getAllPostsMeta()

  return posts.map((post) => ({
    year: post.year,
    month: post.month,
    slug: post.slug,
  }))
}

// メタデータを動的に生成
export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const paramsData = await params
  const year = paramsData.year
  const month = paramsData.month
  const slug = paramsData.slug

  const post = getPost(year, month, slug)

  if (!post) {
    return {
      title: '記事が見つかりません',
      description: '記事が見つかりません',
    }
  }

  const url = `https://himi.blog/posts/${year}/${month}/${slug}`
  const ogImageUrl = new URL(`/api/og/post`, 'https://himi.blog')

  // OG画像のURLパラメータを設定
  ogImageUrl.searchParams.append('title', post.meta.title)

  return {
    title: `${post.meta.title} | himi.blog`,
    description: post.meta.description,
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      type: 'article',
      publishedTime: post.meta.createdAt,
      modifiedTime: post.meta.updatedAt,
      url,
      tags: post.meta.tags,
      images: [
        {
          url: ogImageUrl.toString(),
          width: 1200,
          height: 630,
          alt: post.meta.title + ' | himi.blog',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta.title,
      description: post.meta.description,
      images: [ogImageUrl.toString()],
      creator: '@himi_himi_',
      site: '@himi_himi_',
    },
    alternates: {
      canonical: url,
      types: {
        'application/rss+xml': 'https://himi.blog/api/rss',
      },
    },
  }
}

// 記事詳細ページ
export default async function PostPage({ params }: { params: PageParams }) {
  const paramsData = await params
  const year = paramsData.year
  const month = paramsData.month
  const slug = paramsData.slug

  const post = getPost(year, month, slug)

  if (!post) {
    notFound()
  }

  const recentPosts = getAllPostsMeta()
    .slice(0, 3)
    .filter((p) => !(p.year === year && p.month === month && p.slug === slug))

  const code = String(
    await compile(post.content, {
      outputFormat: 'function-body',
      remarkPlugins: [[remarkGfm]],
      rehypePlugins: [[rehypePrettyCode, { theme: 'dark-plus' }]],
    }),
  )
  const { default: MDXContent } = await run(code, {
    ...runtime,
    baseUrl: import.meta.url,
  })

  const postUrl = `https://himi.blog/posts/${year}/${month}/${slug}`

  const ogImageUrl = new URL(`/api/og/post`, 'https://himi.blog')
  // OG画像のURLパラメータを設定
  ogImageUrl.searchParams.append('title', post.meta.title)

  const metaData = post.meta

  return (
    <div className="max-w-4xl mx-auto">
      <Script
        id="article-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            url: postUrl,
            headline: metaData.title,
            description: metaData.description,
            datePublished: metaData.createdAt,
            dateModified: metaData.updatedAt || metaData.createdAt,
            image: {
              '@type': 'ImageObject',
              url: ogImageUrl.toString(),
              width: 1200,
              height: 630,
              caption: metaData.title,
            },
            author: {
              '@type': 'Person',
              name: 'Takahiro Himi',
              url: 'https://himi.blog',
              sameAs: ['https://x.com/himi_himi_', 'https://github.com/TakahiroHimi'],
              image: {
                '@type': 'ImageObject',
                url: 'https://himi.blog/logo.png',
              },
            },
            publisher: {
              '@type': 'Organization',
              name: 'himi.blog',
              url: 'https://himi.blog',
              sameAs: ['https://x.com/himi_himi_', 'https://github.com/TakahiroHimi'],
              logo: {
                '@type': 'ImageObject',
                url: 'https://himi.blog/logo.png',
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': postUrl,
            },
            keywords: metaData.tags,
            inLanguage: 'ja-JP',
          }),
        }}
      />
      <article className="max-w-none">
        <header className="not-prose mb-8">
          <h1 className="text-3xl font-bold mb-3 text-gray-900">{metaData.title}</h1>
          <div className="flex flex-wrap items-center text-sm text-gray-600 mb-3 gap-x-4">
            <time dateTime={metaData.createdAt} className="flex items-center">
              <span className="mr-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </span>
              <span className="mr-1">投稿日:</span>
              {new Date(metaData.createdAt).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>

            {metaData.updatedAt && (
              <time dateTime={metaData.updatedAt} className="flex items-center">
                <span className="mr-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </span>
                <span className="mr-1">更新日:</span>
                {new Date(metaData.updatedAt).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {metaData.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </header>

        <div className="prose prose-lg prose-headings:font-semibold prose-a:text-blue-600 max-w-none prose-inline-code:before:hidden prose-inline-code:after:hidden prose-inline-code:bg-gray-100 prose-inline-code:rounded-md prose-inline-code:p-1 prose-inline-code:text-gray-700 test-code:bg-red-500">
          <MDXContent components={components} />
        </div>
      </article>

      <div className="my-8 flex justify-center gap-8">
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(`${metaData.title} @himi_himi_`)}`}
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
              <div
                key={`${post.year}-${post.month}-${post.slug}`}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
              >
                <Link href={`/posts/${post.year}/${post.month}/${post.slug}`} className="block">
                  <h3 className="font-medium mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">{post.description}</p>
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

export const dynamicParams = false
