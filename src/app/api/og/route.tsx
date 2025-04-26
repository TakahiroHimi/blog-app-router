import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    // TODO：内容を修正
    (
      <div
        style={{
          display: 'flex',
          fontSize: 60,
          color: 'white',
          background: 'linear-gradient(to bottom, #3b82f6, #1e3a8a)',
          width: '100%',
          height: '100%',
          padding: '50px 200px',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <div style={{ fontSize: 90, fontWeight: 'bold', marginBottom: 20 }}>Tech Blog</div>
        <div style={{ fontSize: 40, opacity: 0.8 }}>
          Webフロントエンドやアクセシビリティに関する技術的な学びを共有するブログです
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
} 