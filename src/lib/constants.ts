/**
 * アプリケーション全体で使用される定数
 */

/**
 * ベースURL - 環境によって変わります
 * - 開発環境: http://localhost:3000
 * - 本番環境: https://himi.blog
 */
export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || (process.env.NODE_ENV === 'production' ? 'https://himi.blog' : 'http://localhost:3000')

/**
 * 絶対URLを取得するためのヘルパー関数
 * @param path - URLのパス部分（/から始まる）
 * @returns 絶対URL
 */
export function getAbsoluteUrl(path: string): string {
  // パスが/で始まっていない場合は追加
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${BASE_URL}${normalizedPath}`
}
