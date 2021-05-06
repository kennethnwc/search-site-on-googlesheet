const colors = require('tailwindcss/colors')

module.exports = {
  // purge: [],
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      ...colors
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
