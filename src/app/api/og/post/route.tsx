import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // URLパラメータを取得
    const title = searchParams.get('title')
    const date = searchParams.get('date')
    
    // パラメータが無い場合はエラー
    if (!title) {
      return new Response('Missing title parameter', { status: 400 })
    }
    
    // 日付のフォーマット
    let formattedDate = ''
    if (date) {
      const dateObj = new Date(date)
      formattedDate = dateObj.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }

    // OG画像を生成して返す
    // TODO：内容を修正
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            fontSize: 60,
            color: 'white',
            background: 'linear-gradient(to bottom, #3b82f6, #1e3a8a)',
            width: '100%',
            height: '100%',
            padding: '50px 80px',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div style={{ 
            fontSize: 70, 
            fontWeight: 'bold', 
            marginBottom: 20,
            display: 'flex',
            flexWrap: 'wrap',
            wordBreak: 'break-word',
            lineHeight: 1.2,
          }}>
            {title}
          </div>
          
          {date && (
            <div style={{ 
              fontSize: 36, 
              opacity: 0.8,
              marginTop: 20,
              fontWeight: 'normal'
            }}>
              {formattedDate}
            </div>
          )}
          
          <div style={{ 
            fontSize: 32, 
            opacity: 0.8,
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
          }}>
            <div style={{ marginRight: 10 }}>Tech Blog</div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error('OG Image generation error:', error)
    return new Response('Failed to generate OG image', { status: 500 })
  }
} 