/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  extend: {
    colors: {
      primary: '#FF9F1C',
      secondary: '#FFBF69',
      accent: '#CBF3F0',
      background: '#FFF8F0',
      textDark: '#2E2E2E',
    },
    fontFamily: {
      fun: ['"Poppins"', 'sans-serif'],
    }
  },
}
,
  plugins: [],
}
