/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          100: '#1e293b',
          200: '#1a2332',
          300: '#151f2a',
          400: '#0f172a',
          500: '#0a0f1a',
        },
        cyber: {
          green: '#00ff88',
          blue: '#00ccff',
          purple: '#8b5cf6',
          red: '#ff375f',
          orange: '#ff6b35'
        }
      },
    },
  },
  plugins: [],
}