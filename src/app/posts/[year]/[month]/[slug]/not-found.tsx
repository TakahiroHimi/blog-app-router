import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-3xl font-bold mb-4">記事が見つかりません</h2>
      <p className="text-lg text-gray-600 mb-8">
        お探しの記事は削除されたか、URLが間違っている可能性があります。
      </p>
      <Link 
        href="/" 
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors"
      >
        記事一覧に戻る
      </Link>
    </div>
  )
} 