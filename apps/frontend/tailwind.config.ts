import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sarabun', 'sans-serif'],
        heading: ['Kanit', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#763f9a',
          dark: '#60317f',
          soft: '#f2eaf6',
        },
        secondary: {
          DEFAULT: '#9f52a4',
          dark: '#834087',
          soft: '#f7edf7',
        },
        highlight: {
          DEFAULT: '#fbf48a',
          soft: '#fffde2',
        },
        success: {
          DEFAULT: '#54b254',
          dark: '#3f8f42',
          soft: '#edf8ed',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
