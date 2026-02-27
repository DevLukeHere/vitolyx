/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#e0f7f8',
          100: '#b3ecef',
          200: '#80dfe4',
          300: '#4dd1d8',
          400: '#1ac1c9',
          500: '#00ADB5',
          600: '#008c93',
          700: '#006b71',
          800: '#004a4f',
          900: '#00363a',
        },
        surface: {
          light: '#EEEEEE',
          dark: '#222831',
        },
        charcoal: '#222831',
        gunmetal: '#393E46',
        cloud: '#EEEEEE',
        flag: {
          low: '#f59e0b',
          normal: '#22c55e',
          high: '#ef4444',
        },
      },
    },
  },
  plugins: [],
};
