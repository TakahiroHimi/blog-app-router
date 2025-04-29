import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Noto_Sans_JP } from 'next/font/google'
import { Header } from '@/components/Header/Header'
import { Footer } from '@/components/Footer/Footer'
import Script from 'next/script'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const notoSansJP = Noto_Sans_JP({
  variable: '--font-noto-sans-jp',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  preload: false,
})

// GA4の測定ID（実際の値に置き換える）
const GA_MEASUREMENT_ID = 'G-WFFESS2BGN'

export const metadata: Metadata = {
  title: 'himi.blog',
  description: 'himi.blog',
  metadataBase: new URL('https://himi.blog'),
  keywords: ['フロントエンド', 'TypeScript', 'Next.js', 'React', 'アクセシビリティ'],
  authors: [{ name: 'himi', url: 'https://himi.blog' }],
  creator: '@himi_himi_',
  publisher: '@himi_himi_',
  applicationName: 'himi.blog',
  generator: 'Next.js',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
  },
  openGraph: {
    title: 'himi.blog',
    description: 'himi.blog',
    url: 'https://himi.blog',
    siteName: 'himi.blog',
    type: 'website',
    images: [
      {
        url: 'https://himi.blog/api/og',
        width: 1200,
        height: 630,
        alt: 'himi.blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'himi.blog',
    description: 'himi.blog',
    images: ['https://himi.blog/api/og'],
    creator: '@himi_himi_',
    site: '@himi_himi_',
  },
  alternates: {
    canonical: 'https://himi.blog',
    types: {
      'application/rss+xml': 'https://himi.blog/api/rss',
    },
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansJP.variable} font-sans antialiased min-h-screen flex flex-col bg-white text-gray-900`}
      >
        {/* Google Analytics */}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>

        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
