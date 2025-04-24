export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Tech Blog</h1>
        <p className="text-xl text-gray-700 dark:text-gray-300">
          Webフロントエンドやアクセシビリティに関する技術的な学びを共有するブログです
        </p>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-800">最新の投稿</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {/* 記事が追加されるまでのプレースホルダー */}
          <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-md mb-2">
                React
              </span>
              <h3 className="text-xl font-medium mb-2">記事はまだありません</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                これからWebフロントエンドやアクセシビリティに関する記事を投稿していきます。
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">公開準備中</div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-800">このブログについて</h2>
        <div className="prose dark:prose-invert">
          <p>
            このブログでは、Webフロントエンドやアクセシビリティに関する技術的な学びを共有していきます。
            React、TypeScript、HTML、CSS、アクセシビリティ（WCAG）などのトピックを扱う予定です。
          </p>
          <p>技術的な学びだけでなく、日々の開発で得た知見やTipsなども共有していきます。</p>
        </div>
      </div>
    </div>
  )
}
