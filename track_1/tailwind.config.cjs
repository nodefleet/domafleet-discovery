/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-blue': '#0F192C',
        'navy-blue': '#1D3053',
        'light-blue': '#559AD0',
        'blue-300': '#93C5FD',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #0F192C, #1D3053)',
      },
    },
  },
  plugins: [],
}


