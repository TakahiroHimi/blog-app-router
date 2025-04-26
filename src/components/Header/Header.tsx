import Link from 'next/link'

export function Header() {
  return (
    <header className="py-4 border-b border-gray-200 relative">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold">
            himi.blog
          </Link>
        </div>
      </div>
    </header>
  )
}
