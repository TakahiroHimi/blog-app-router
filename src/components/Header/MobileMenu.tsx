'use client'

import Link from 'next/link'
import { ThemeToggle } from '../ThemeToggle/ThemeToggle'
import { useButton } from 'react-aria'
import { useRef, useState, useEffect } from 'react'

export function MobileMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton(
    {
      onPress: () => {
        setIsMenuOpen(!isMenuOpen)
      },
    },
    menuButtonRef,
  )

  // ESCキーでメニューを閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isMenuOpen])

  // モバイルメニュー開閉時に背景スクロールを防止
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  return (
    <div className="md:hidden">
      {/* モバイルメニューボタン */}
      <button
        ref={menuButtonRef}
        {...buttonProps}
        className="p-2 rounded-md text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        aria-label={isMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
        aria-expanded={isMenuOpen}
        aria-controls="mobile-menu"
      >
        {isMenuOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        )}
      </button>

      {/* 透明なオーバーレイ（クリックイベント受け取り用） */}
      {isMenuOpen && <div className="fixed inset-0 md:hidden z-10" aria-hidden="true" onClick={() => setIsMenuOpen(false)} />}

      {/* モバイルメニュー */}
      <div
        id="mobile-menu"
        className={`
          fixed right-0 top-0 h-full w-[250px] z-20
          bg-[#fff] dark:bg-[#111] shadow-[0_0_25px_rgba(0,0,0,0.15)] dark:shadow-[0_0_25px_rgba(0,0,0,0.5)]
          overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        role="menu"
        aria-orientation="vertical"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
          <span className="font-bold">メニュー</span>
          <button
            className="p-2 rounded-md text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            onClick={() => setIsMenuOpen(false)}
            aria-label="メニューを閉じる"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col p-4">
          <Link
            href="/"
            className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-2 py-3 border-b border-gray-200 dark:border-gray-800"
            onClick={() => setIsMenuOpen(false)}
          >
            ホーム
          </Link>
          <Link
            href="/posts"
            className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-2 py-3 border-b border-gray-200 dark:border-gray-800"
            onClick={() => setIsMenuOpen(false)}
          >
            記事一覧
          </Link>
          <div className="px-2 py-3 flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">テーマ切り替え</span>
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </div>
  )
}
