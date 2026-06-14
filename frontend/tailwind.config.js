/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fcfaf6',
          100: '#f6f1e8',
          200: '#ece1ce',
          300: '#dccba9',
          400: '#c5a880', // Principal Champagne Accent
          500: '#b5976f',
          600: '#9b7e56',
          700: '#816541',
          800: '#695033',
          900: '#533e28',
          950: '#302214',
        },
        obsidian: {
          900: '#0c0e14',
          950: '#05070a',
        },
        mint: {
          50: '#f4f8f7',
          100: '#e0ebe8',
          250: '#cedbd7',
        },
        forest: {
          50: '#eef5f4',
          100: '#dcece9',
          200: '#bad9d3',
          300: '#8cbeb4',
          400: '#5c9e92',
          500: '#408276',
          600: '#31675c',
          700: '#2a534b',
          800: '#24443e',
          900: '#0a1f1b',
          950: '#0e2a25', // Main forest green branding color
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
