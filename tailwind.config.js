/** @type {import('tailwindcss').Config} */
import themePlugin from './src/styles/tailwind-theme.js';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/styles/**/*.css",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B6098',
          light: '#5E82BC',
          dark: '#2C4A78',
        },
        secondary: {
          DEFAULT: '#4C9A82',
          light: '#77B9A4',
          dark: '#3A7D68',
        },
        background: {
          DEFAULT: '#0F1826',
          paper: '#16202E',
        },
        text: {
          DEFAULT: '#ECF1F7',
          secondary: '#9BA9BA',
        },
        border: '#E4E9F1',
        success: '#4C9A82',
        error: '#D46A6A',
        warning: '#D9A45B',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'Roboto', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
      },
    },
  },
  plugins: [themePlugin],
  corePlugins: {
    preflight: false,
  }
}
