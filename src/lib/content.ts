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
 * すべての記事のメタデータを取得
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
    : allPostsMeta.filter((post) => post.published && !post.isTest)

  // createdAtで降順にソート
  return filteredPostsMeta.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

/**
 * 指定されたslugの記事のメタデータと記事コンテンツを取得
 */
export function getPost(year: string, month: string, slug: string): { meta: PostMeta, content: string } | undefined {
  const filePath = path.join(postsDirectory, year, month, `${slug}.mdx`)

  if (!fs.existsSync(filePath)) {
    return undefined
  }

  // ファイルの内容を読み込む
  const { data, content, excerpt } = matter.read(filePath, { excerpt: true })

  const replacedContent = content.replace(excerpt! + '---', '')

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
    content: replacedContent,
  }
}

/**
 * dataがFrontmatter型であることを検証する関数
 */
export function isFrontmatter(data: unknown): data is Frontmatter {
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

// 記事データのルートディレクトリのパス
const postsDirectory = path.join(process.cwd(), 'src/posts')
// 環境変数に基づいてテスト記事を表示するかどうかを判断する
const shouldDisplayTestPosts = process.env.NODE_ENV !== 'production' || process.env.SHOW_TEST_POSTS === 'true'

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
  const postsMetaList = filesInDirectory.map((file) => {
    const post = getPost(year, month, file.replace('.mdx', ''))
    if (!post) {
      return undefined
    }
    return post.meta
  }).filter((post) => post !== undefined)

  // createdAtで降順にソート
  return postsMetaList.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

/**
 * 指定されたslugの記事の冒頭部分から適切な長さの説明文を生成する
 */
// export function old_generateDescriptionFromSlug(year: string, month: string, slug: string): string {
//   // 引数からファイルパスを生成
//   const filePath = path.join(postsDirectory, year, month, `${slug}.mdx`)

//   // ファイルの内容を読み込む
//   const fileContents = fs.readFileSync(filePath, 'utf8')

//   return generateDescriptionFromContent(fileContents)
// }

/**
 * 指定されたslugの記事のメタデータを取得
 */
// export function old_getPostMetaBySlug(
//   year: string,
//   month: string,
//   slug: string,
// ): PostMeta | undefined {
//   // 指定した年月ディレクトリ内のすべてのファイルを取得
//   const yearMonthDirectory = path.join(postsDirectory, year, month)

//   // ディレクトリが存在しない場合はnullを返す
//   if (!fs.existsSync(yearMonthDirectory)) {
//     return undefined
//   }

//   // スラッグに一致するファイルを探す
//   const file = fs.readdirSync(yearMonthDirectory).find((file) => file.match(new RegExp(`\\d{2}_${slug}\\.mdx?$`)))

//   // 対応するファイルがない場合はnullを返す
//   if (!file) {
//     return undefined
//   }

//   // ファイルパス
//   const filePath = path.join(yearMonthDirectory, file)

//   // ファイルの内容を読み込む
//   const fileContents = fs.readFileSync(filePath, 'utf8')

//   // frontmatterとcontentをパース
//   const { data, content } = matter(fileContents)

//   const meta = {
//     ...data,
//     slug,
//     year,
//     month,
//   } as PostMeta

//   // 記事の冒頭から説明文を自動生成
//   const description = generateDescriptionFromContent(content)

//   // テスト記事の場合、本番環境では非表示
//   if (meta.isTest && !shouldDisplayTestPosts) {
//     return null
//   }

//   return { meta, content, description }
// }