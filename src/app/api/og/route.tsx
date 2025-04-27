import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
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
            justifyContent: 'space-between',
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
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 64,
              fontWeight: 'bold',
              color: '#111827',
              lineHeight: 1.4,
              wordBreak: 'break-word',
              textAlign: 'left',
              flexGrow: 1,
            }}
          >
            himi.blog
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 80,
                height: 80,
                backgroundImage: `url(https://himi.blog/profile_image_75_75.png)`,
                borderRadius: 100,
              }}
            />
            <div style={{ fontSize: 32, color: '#6B7280' }}>himi.blog</div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
} 