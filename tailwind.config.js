/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#14213D',
          50: '#EEF0F5',
          100: '#D6DBE6',
          200: '#AEB8CC',
          300: '#8590AC',
          400: '#5D6C8E',
          500: '#3C4B70',
          600: '#233256',
          700: '#14213D',
          800: '#0F1830',
          900: '#0A1122',
        },
        paper: '#EFF1EC',
        panel: '#F8F8F6',
        steel: '#5B6472',
        line: '#DBDFE1',
        brass: {
          DEFAULT: '#8A6D3B',
          light: '#F1E9D8',
        },
        verified: {
          DEFAULT: '#1F7A5C',
          bg: '#E4F1EC',
          border: '#B9DBCC',
        },
        caution: {
          DEFAULT: '#A97319',
          bg: '#FAF0DC',
          border: '#EAD3A0',
        },
        violation: {
          DEFAULT: '#A8342A',
          bg: '#F6E6E4',
          border: '#E4BAB4',
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        panel: '0 1px 2px rgba(20, 33, 61, 0.06), 0 1px 1px rgba(20, 33, 61, 0.04)',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(6px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        scanline: 'scanline 2.4s ease-in-out infinite',
        fadeUp: 'fadeUp 0.35s ease-out both',
      },
    },
  },
  plugins: [],
}
