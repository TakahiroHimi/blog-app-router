import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // srcディレクトリ内の*.test.ts または *.test.tsx パターンのファイルのみをテスト対象とする
    include: ['src/**/*.test.{ts,tsx}'],
    // node_modules、*.ct.spec.tsx や *.ct.vrt.spec.tsx パターンのファイルを除外する
    exclude: ['**/node_modules/**', '**/*.ct.spec.{ts,tsx}', '**/*.ct.vrt.spec.{ts,tsx}'],
  },
})
