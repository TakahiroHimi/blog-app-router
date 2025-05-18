import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'var(--font-noto-sans-jp)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            details: {
              borderStyle: 'solid',
              borderWidth: '1px',
              borderColor: 'var(--color-gray-200)',
              borderRadius: 'var(--radius-md)',
              padding: 'calc(var(--spacing) * 4)',

              '&[open] summary': {
                marginBottom: 'calc(var(--spacing) * 4)',
              },
            },
          },
        },
      },
    },
  },
  plugins: [typography],
}

export default config
