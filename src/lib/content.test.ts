import { describe, expect, test, vi, afterEach } from 'vitest'
import { getPostsByTag, getPost, getAllPostsMeta } from './content'
import matter from 'gray-matter'
import path from 'path'
import fs from 'fs'

describe('getPostsByTag', () => {
  test('テストタグの記事を取得できる', () => {
    const posts = getPostsByTag('テスト')
    expect(posts).toHaveLength(3)

    expect(posts[0].tags).toContain('テスト')
    expect(posts[1].tags).toContain('テスト')
    expect(posts[2].tags).toContain('テスト')
  })

  test('存在しないタグを指定した場合、空配列が返される', () => {
    const posts = getPostsByTag('存在しないタグ')
    expect(posts).toHaveLength(0)
    expect(posts).toEqual([])
  })

  test('空のタグ文字列で検索すると空配列が返される', () => {
    const posts = getPostsByTag('')
    expect(posts).toHaveLength(0)
    expect(posts).toEqual([])
  })
})

describe('getPost', () => {
  test('存在する記事を取得できる', () => {
    const post = getPost('2099', '01', '01_markdown-test')

    // postがundefinedでない場合はテストを失敗させる
    if (!post) {
      throw new Error('記事が見つかりません')
    }

    expect(post).toBeDefined()
    expect(post.meta).toBeDefined()
    expect(post.content).toBeDefined()

    // メタデータが正しく取得できていることを確認
    expect(post.meta.title).toBe('マークダウンテスト用ページ')
    expect(post.meta.createdAt).toBe('2099-01-01')
    expect(post.meta.updatedAt).toBe('2099-01-01')
    expect(post.meta.tags).toEqual(['テスト', 'マークダウン'])
    expect(post.meta.published).toBe(true)
    expect(post.meta.isTest).toBe(true)
    expect(post.meta.slug).toBe('01_markdown-test')
    expect(post.meta.year).toBe('2099')
    expect(post.meta.month).toBe('01')
    expect(post.meta.description).toBe(
      'このページはマークダウンテストのために作成された特別なページです。一般ユーザーには表示されません。 見出しレベル1 見出しレベル2 見出しレベル3 見出しレベル4 見出しレベル5 見出しレベル6 テキストのスタイル設定 **これは太字テキストです** _これは斜体テキストです_ ~~これは取り消し線テキストです~~...',
    )

    // コンテンツの内容を確認
    const content = matter(post.content).content
    expect(post.content).toEqual(content)
  })

  test('存在しない記事はundefinedが返される', () => {
    const post = getPost('9999', '99', '存在しない記事')
    expect(post).toBeUndefined()
  })
})

describe('getAllPostsMeta', () => {
  test('すべての記事メタデータを取得できる', () => {
    // 本番環境を想定してテスト
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('SHOW_TEST_POSTS', 'false')

    const posts = getAllPostsMeta()

    // 手動でファイル数をカウント
    const postsDirectory = path.join(process.cwd(), 'src/posts')
    let expectedCount = 0

    // 年ディレクトリを全て取得
    const yearDirs = fs.readdirSync(postsDirectory)

    yearDirs.forEach((year) => {
      const yearPath = path.join(postsDirectory, year)

      // 月ディレクトリを全て取得
      const monthDirs = fs.readdirSync(yearPath)

      monthDirs.forEach((month) => {
        const monthPath = path.join(yearPath, month)
        const files = fs.readdirSync(monthPath).filter((file) => file.endsWith('.mdx'))

        files.forEach((file) => {
          const filePath = path.join(monthPath, file)
          const { data } = matter.read(filePath)

          // 公開済みで非テスト記事のみカウント
          if (data.published && !data.isTest) {
            expectedCount++
          }
        })
      })
    })

    expect(posts.length).toBe(expectedCount)

    // 各記事のメタデータが正しい形式であることを確認
    posts.forEach((post) => {
      expect(post).toHaveProperty('title')
      expect(post).toHaveProperty('createdAt')
      expect(post).toHaveProperty('tags')
      expect(Array.isArray(post.tags)).toBe(true)
      expect(post).toHaveProperty('published')
      expect(post.published).toBe(true)
      expect(post.isTest).not.toBe(true) // テスト記事でないことを確認
      expect(post).toHaveProperty('slug')
      expect(post).toHaveProperty('year')
      expect(post).toHaveProperty('month')
      expect(post).toHaveProperty('description')
    })

    // テスト後に環境変数をリセット
    vi.unstubAllEnvs()
  })

  test('記事が作成日の降順でソートされている', () => {
    const posts = getAllPostsMeta()

    // 配列が空でないことを確認
    expect(posts.length).toBeGreaterThan(0)

    // 記事が作成日の降順でソートされていることを確認
    for (let i = 0; i < posts.length - 1; i++) {
      const currentDate = new Date(posts[i].createdAt).getTime()
      const nextDate = new Date(posts[i + 1].createdAt).getTime()
      expect(currentDate).toBeGreaterThanOrEqual(nextDate)
    }
  })

  describe('環境変数によるフィルタリング', () => {
    afterEach(() => {
      // テスト後に環境変数をリセット
      vi.unstubAllEnvs()
    })

    test('本番環境ではテスト記事が除外される', () => {
      vi.stubEnv('NODE_ENV', 'production')
      vi.stubEnv('SHOW_TEST_POSTS', 'false')

      const productionPosts = getAllPostsMeta()

      // isTest: trueの記事が含まれていないことを確認
      const testPostInProduction = productionPosts.find((post) => post.isTest === true)

      expect(testPostInProduction).toBeUndefined()
    })

    test('開発環境ではテスト記事が含まれる', () => {
      // 開発環境を設定
      vi.stubEnv('NODE_ENV', 'development')

      const developmentPosts = getAllPostsMeta()

      // isTest: trueの記事も含まれていることを確認（ただし公開済みの記事のみ）
      const publishedTestPost = developmentPosts.find((post) => post.isTest === true && post.published === true)
      expect(publishedTestPost).toBeDefined()
    })

    test('SHOW_TEST_POSTSフラグでテスト記事の表示を制御できる', () => {
      // 本番環境だがテスト記事表示フラグがオン
      vi.stubEnv('NODE_ENV', 'production')
      vi.stubEnv('SHOW_TEST_POSTS', 'true')

      const forcedTestPosts = getAllPostsMeta()

      // 本番環境でもSHOW_TEST_POSTS=trueの場合はisTest: trueの記事が含まれる
      const testPostWithFlag = forcedTestPosts.find((post) => post.isTest === true && post.published === true)
      expect(testPostWithFlag).toBeDefined()
    })
  })

  test('非公開の記事が除外されている', () => {
    const posts = getAllPostsMeta()

    // published: falseの記事が含まれていないことを確認
    const unpublishedPost = posts.find((post) => post.published === false)
    expect(unpublishedPost).toBeUndefined()
  })
})
