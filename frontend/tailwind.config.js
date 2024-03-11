/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'stupidgraph': "url('./src/assets/graph.jpg')",
        'downloadbot': "url('./src/assets/downloadbot.png')",
      }
    }
  },
  plugins: [],
}

