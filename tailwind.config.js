/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 주황색 기반 Primary 색상 팔레트
        primary: {
          50: '#fff7ed',   // 매우 밝은 주황
          100: '#ffedd5',  // 밝은 주황
          200: '#fed7aa',  // 연한 주황
          300: '#fdba74',  // 부드러운 주황
          400: '#fb923c',  // 중간 주황
          500: '#f97316',  // 기본 주황 (메인 컬러)
          600: '#ea580c',  // 진한 주황
          700: '#c2410c',  // 더 진한 주황
          800: '#9a3412',  // 매우 진한 주황
          900: '#7c2d12',  // 가장 진한 주황
        },
        // 보조 색상 - 따뜻한 느낌의 색상들
        secondary: {
          50: '#fef3c7',
          100: '#fde68a',
          200: '#fcd34d',
          300: '#fbbf24',
          400: '#f59e0b',
          500: '#d97706',
          600: '#b45309',
          700: '#92400e',
          800: '#78350f',
          900: '#451a03',
        },
        // 액센트 색상 - 따뜻한 블루 (대비를 위해)
        accent: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        }
      },
      // 그림자에도 주황색 톤 추가
      boxShadow: {
        'primary': '0 4px 14px 0 rgba(249, 115, 22, 0.15)',
        'primary-lg': '0 10px 40px 0 rgba(249, 115, 22, 0.2)',
      },
      // 따뜻한 느낌의 그라디언트
      backgroundImage: {
        'gradient-warm': 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ea580c 100%)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
