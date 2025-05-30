import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { BASE_URL } from '@/lib/constants'
export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    // タイトルを取得
    const title = searchParams.get('title')
    if (!title) {
      return new Response('Missing title parameter', { status: 400 })
    }

    // OG画像を生成して返す
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            maxWidth: 1200,
            height: '100%',
            maxHeight: 630,
            background: 'linear-gradient(to bottom right, #E6E6E6 0%, #F3F4F6 50%, #D1D5DB 100%)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              background: 'white',
              padding: '60px',
              borderRadius: 24,
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              width: '90%',
              height: '90%',
            }}
          >
            <div
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitBoxPack: 'center',
                WebkitBoxAlign: 'center',
                WebkitLineClamp: 3,
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: 64,
                fontWeight: 'bold',
                color: '#111827',
                lineHeight: 1.4,
                wordBreak: 'break-word',
                textAlign: 'left',
                flexGrow: 1,
              }}
            >
              {title}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  backgroundImage: `url(${BASE_URL}/profile_image_75_75.png)`,
                  borderRadius: 100,
                }}
              />
              <div style={{ fontSize: 32, color: '#6B7280' }}>blog.himi.dev</div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (error) {
    console.error('OG Image generation error:', error)
    return new Response('Failed to generate OG image', { status: 500 })
  }
}
