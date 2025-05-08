import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

/**
 * 記事のメタデータの型定義
 */
export type PostMeta = Frontmatter & {
  slug: string
  year: string
  month: string
  description: string
}

type Frontmatter = {
  title: string
  createdAt: string
  updatedAt?: string | undefined
  tags: string[]
  published: boolean
  isTest?: boolean | undefined
}

/**
 * すべての記事のメタデータを取得する
 */
export function getAllPostsMeta(): PostMeta[] {
  // 年ディレクトリを全て取得
  const yearDirs = fs.readdirSync(postsDirectory)

  const allPostsMeta: PostMeta[] = yearDirs.flatMap((year) => {
    const yearPath = path.join(postsDirectory, year)

    // 月ディレクトリを全て取得
    const monthDirs = fs.readdirSync(yearPath)

    // 各月ディレクトリの記事を全て取得して追加
    return monthDirs.flatMap((month) => {
      return getPostsMetaByYearAndMonth(year, month)
    })
  })

  // 本番環境ではisTest: trueのフラグがある記事を除外
  const filteredPostsMeta = shouldDisplayTestPosts
    ? allPostsMeta.filter((post) => post.published)
    : allPostsMeta.filter((post) => {
        console.log('post', post)
        console.log('post.published === true', post.published === true)
        console.log('post.isTest === true', post.isTest === true)
        console.log('post.published && !post.isTest', post.published && !post.isTest)
        return post.published && !post.isTest
      })

  console.log('########################################################################')
  console.log('shouldDisplayTestPosts', shouldDisplayTestPosts)
  console.log('process.env.NODE_ENV', process.env.NODE_ENV)
  console.log('process.env.CI', process.env.CI)
  console.log('process.env.SHOW_TEST_POSTS', process.env.SHOW_TEST_POSTS)
  console.log('allPostsMeta', allPostsMeta)
  console.log('filteredPostsMeta', filteredPostsMeta)
  console.log('########################################################################')

  // createdAtで降順にソート
  return filteredPostsMeta.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

/**
 * 指定されたslugの記事のメタデータと記事コンテンツを取得する
 */
export function getPost(year: string, month: string, slug: string): { meta: PostMeta; content: string } | undefined {
  const filePath = path.join(postsDirectory, year, month, `${slug}.mdx`)

  if (!fs.existsSync(filePath)) {
    return undefined
  }

  // ファイルの内容を読み込む
  const { data, content } = matter.read(filePath)

  if (!isFrontmatter(data)) {
    throw new Error(`Invalid frontmatter in post: ${year}/${month}/${slug}`)
  }

  const description = generateDescriptionFromContent(content)

  return {
    meta: {
      ...data,
      slug,
      year,
      month,
      description,
    },
    content,
  }
}

// 記事データのルートディレクトリのパス
const postsDirectory = path.join(process.cwd(), 'src/posts')
// 環境変数に基づいてテスト記事を表示するかどうかを判断する
const shouldDisplayTestPosts = process.env.NODE_ENV !== 'production' || process.env.CI || process.env.SHOW_TEST_POSTS === 'true'

/**
 * 記事の文章から適切な長さの説明文を生成する
 */
function generateDescriptionFromContent(content: string, maxLength: number = 160): string {
  // HTMLタグとMarkdownリンクを削除
  const plainText = content
    .replace(/<[^>]+>/g, '') // HTMLタグを削除
    .replace(/!\[.*?\]\(.*?\)/g, '') // 画像を削除
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1') // Markdownリンクをテキストのみに置換
    .replace(/#+\s+/g, '') // 見出しの#を削除
    .replace(/\n+/g, ' ') // 改行を空白に置換
    .trim()

  // 適切な長さで切り取る
  if (plainText.length <= maxLength) {
    return plainText
  }

  // 最後の単語が途切れないように調整
  let truncated = plainText.substring(0, maxLength)
  const lastSpaceIndex = truncated.lastIndexOf(' ')

  if (lastSpaceIndex !== -1) {
    truncated = truncated.substring(0, lastSpaceIndex)
  }

  return truncated + '...'
}

/**
 * 指定した年と月のディレクトリ配下のMDXファイルを全て読み込み、メタデータを返す
 */
function getPostsMetaByYearAndMonth(year: string, month: string): PostMeta[] {
  const yearMonthDirectory = path.join(postsDirectory, year, month)

  // ディレクトリが存在しない場合は空配列を返す
  if (!fs.existsSync(yearMonthDirectory)) {
    return []
  }

  // 指定ディレクトリ内のmdxファイルを取得
  const filesInDirectory = fs.readdirSync(yearMonthDirectory).filter((file) => file.endsWith('.mdx'))

  // ファイルからメタデータを取得
  const postsMetaList = filesInDirectory
    .map((file) => {
      const post = getPost(year, month, file.replace('.mdx', ''))
      if (!post) {
        return undefined
      }
      return post.meta
    })
    .filter((post) => post !== undefined)

  // createdAtで降順にソート
  return postsMetaList.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

/**
 * タグで記事をフィルタリングする
 */
export function getPostsByTag(tag: string): PostMeta[] {
  const allPosts = getAllPostsMeta()
  return allPosts.filter((post) => post.tags.includes(tag))
}

/**
 * dataがFrontmatter型であることを検証する
 */
function isFrontmatter(data: unknown): data is Frontmatter {
  return (
    typeof data === 'object' &&
    data !== null &&
    'title' in data &&
    typeof data.title === 'string' &&
    'createdAt' in data &&
    typeof data.createdAt === 'string' &&
    (!('updatedAt' in data) || ('updatedAt' in data && (typeof data.updatedAt === 'string' || data.updatedAt === undefined))) &&
    'tags' in data &&
    Array.isArray(data.tags) &&
    data.tags.every((tag: unknown) => typeof tag === 'string') &&
    'published' in data &&
    typeof data.published === 'boolean' &&
    (!('isTest' in data) || ('isTest' in data && (typeof data.isTest === 'boolean' || data.isTest === undefined)))
  )
}
