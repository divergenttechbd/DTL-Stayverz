import type { Config } from 'tailwindcss'

const navbar = '84px'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backgroundColor: {
        'primaryHover': '#f1f1f1',
        'grayBg': '#f7f7f7'
      },
      container: {
        center: true,
        'padding': '1.25rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1280px',
        },
      },
      colors: {
        'primaryColor': '#D53858',
        'grayText': '#717171',
        'grayBorder': '#DDDDDD',
        'darkGray': '#222222',
        'lightGrayText': '#9C9C9C',
        'brandColor': '#F15927'
      },
      maxWidth: {
        'desktopSmall': '1162px',
        'desktopMedium': '1440px'
      },
      translate: {
        '0': '0%',
        'full': '100%',
      },
      height: {
        navbar,
        content: `calc(100vh - ${navbar})`,
        'screen-dynamic': '100dvh'
      },
      minHeight: {
        navbar,
      },
      margin: {
        navbar
      },
      padding: {
        navbar
      },
      spacing: {
        navbar,
      },
      boxShadow: {
        't-sm': '0 -1px 2px 0 rgb(0 0 0 / 0.05)'
      },
      animation: {
        'reverse-spin': 'reverse-spin 1s linear infinite'
      },
      keyframes: {
        'reverse-spin': {
          from: {
            transform: 'rotate(360deg)'
          },
        }
      }
    },
  },
  plugins: [],
}
export default config
