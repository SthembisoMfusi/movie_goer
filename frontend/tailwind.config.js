/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        imdb: {
          yellow: '#f5c518',
          black: '#121212',
          dark: '#1f1f1f',
          light: '#f8f9fa'
        }
      }
    },
  },
  plugins: [],
}