import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// 記事のメタデータの型定義
export type PostMeta = {
  title: string
  description: string
  date: string
  tags: string[]
  published: boolean
  slug: string
  year: string
  month: string
  day: string
}

// ルートディレクトリのパス
const postsDirectory = path.join(process.cwd(), 'posts')

/**
 * 指定した年と月のディレクトリからMDXファイルを読み込み、メタデータを返す
 */
export function getPostsByYearAndMonth(year: string, month: string): PostMeta[] {
  const yearMonthDirectory = path.join(postsDirectory, year, month)
  
  if (!fs.existsSync(yearMonthDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(yearMonthDirectory)
  const mdxFiles = fileNames.filter(fileName => fileName.endsWith('.mdx'))

  const posts = mdxFiles.map(fileName => {
    // ファイル名からスラッグと日付を抽出
    // 形式: DD_slug.mdx (例: 01_hello-world.mdx)
    const match = fileName.match(/^(\d{2})_(.+)\.mdx$/)
    
    if (!match) {
      console.warn(`Invalid file name format: ${fileName}`)
      return null
    }
    
    const [, day, slug] = match
    const fullPath = path.join(yearMonthDirectory, fileName)
    
    // ファイルの内容を読み込む
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    
    // gray-matter でフロントマターを解析
    const { data } = matter(fileContents)
    
    // メタデータを返す
    return {
      ...data,
      slug,
      year,
      month,
      day,
    } as PostMeta
  }).filter(Boolean) as PostMeta[] // nullを除外

  // 日付で降順にソート
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * すべての記事のメタデータを取得
 */
export function getAllPosts(): PostMeta[] {
  // 年ディレクトリを取得
  const yearDirs = fs.readdirSync(postsDirectory).filter(dir => {
    // 4桁の数字のディレクトリのみを対象とする
    return /^\d{4}$/.test(dir) && fs.statSync(path.join(postsDirectory, dir)).isDirectory()
  })

  // すべての記事を取得
  let allPosts: PostMeta[] = []

  yearDirs.forEach(year => {
    const yearPath = path.join(postsDirectory, year)
    const monthDirs = fs.readdirSync(yearPath).filter(dir => {
      // 2桁の数字のディレクトリのみを対象とする
      return /^\d{2}$/.test(dir) && fs.statSync(path.join(yearPath, dir)).isDirectory()
    })

    monthDirs.forEach(month => {
      const posts = getPostsByYearAndMonth(year, month)
      allPosts = [...allPosts, ...posts]
    })
  })

  // 公開フラグがtrueの記事のみをフィルター
  const publishedPosts = allPosts.filter(post => post.published)
  
  // 日付で降順にソート
  return publishedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * 記事のスラッグから記事の詳細を取得
 */
export function getPostBySlug(year: string, month: string, slug: string): { meta: PostMeta, content: string } | null {
  // 指定した年月ディレクトリ内のすべてのファイルを取得
  const yearMonthDirectory = path.join(postsDirectory, year, month)
  
  if (!fs.existsSync(yearMonthDirectory)) {
    return null
  }
  
  // ディレクトリ内のファイルを検索
  const fileNames = fs.readdirSync(yearMonthDirectory)
  const matchedFile = fileNames.find(fileName => {
    // DD_slug.mdx 形式からスラッグ部分を抽出して比較
    const match = fileName.match(/^\d{2}_(.+)\.mdx$/)
    return match && match[1] === slug
  })
  
  if (!matchedFile) {
    return null
  }
  
  const fullPath = path.join(yearMonthDirectory, matchedFile)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  
  // ファイル名から日付を抽出
  const dayMatch = matchedFile.match(/^(\d{2})_/)
  const day = dayMatch ? dayMatch[1] : '01' // デフォルト値として01を使用
  
  const meta = {
    ...data,
    slug,
    year,
    month,
    day,
  } as PostMeta

  return { meta, content }
}

/**
 * 最新の記事を指定した件数分取得
 */
export function getRecentPosts(count: number = 3): PostMeta[] {
  const posts = getAllPosts()
  return posts.slice(0, count)
} 