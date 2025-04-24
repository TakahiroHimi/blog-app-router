import Link from 'next/link'
import { MobileMenu } from './MobileMenu'
import { ThemeToggle } from '../ThemeToggle/ThemeToggle'

export function Header() {
  return (
    <header className="py-4 border-b border-gray-200 dark:border-gray-800 relative">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold">
            Tech Blog
          </Link>
        </div>

        {/* デスクトップナビゲーション */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            ホーム
          </Link>
          <Link href="/posts" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            記事一覧
          </Link>
          <ThemeToggle />
        </nav>

        {/* モバイルメニュー (クライアントコンポーネント) */}
        <MobileMenu />
      </div>
    </header>
  )
}
