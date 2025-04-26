import Link from 'next/link'

export function Footer() {
  return (
    <footer className="py-6 border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="text-lg font-medium">
              Tech Blog
            </Link>
            <p className="text-sm text-gray-600">技術的な学びを共有するブログ</p>
          </div>

          <div className="flex items-center">
            <a
              href="https://x.com/himi_himi_"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-blue-500"
              aria-label="X"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} Tech Blog. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
