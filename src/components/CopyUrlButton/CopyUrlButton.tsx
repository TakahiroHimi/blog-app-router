'use client'

import { Button } from 'react-aria-components'

interface CopyUrlButtonProps {
  url: string
}

export const CopyUrlButton: React.FC<CopyUrlButtonProps> = ({ url }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(url)
    alert('URLをコピーしました！')
  }

  return (
    <Button
      onClick={handleCopy}
      className="inline-flex items-center justify-center p-3 border border-gray-300 rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      aria-label="URLをコピー"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <title>URLをコピー</title>
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
    </Button>
  )
}
