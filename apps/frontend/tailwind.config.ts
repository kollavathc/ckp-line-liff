import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sarabun', 'sans-serif'],
        heading: ['Kanit', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
