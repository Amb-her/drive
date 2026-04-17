import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        cream: {
          50: '#fffdf9',
          100: '#fdf4e7',
          200: '#faecd6',
          300: '#f5dfc0',
        },
        warm: {
          900: '#1a1a1a',
          700: '#3d3d3d',
          500: '#6b6b6b',
          400: '#9a9a9a',
          300: '#bfbfbf',
          200: '#e5e5e5',
          100: '#f0f0f0',
        },
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};

export default config;
