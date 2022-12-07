/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.tsx'],
  theme: {
    extend: {
      colors: {
        gray: {
          100: '#e1e1e6',
          300: '#c4c4cc',
          800: '#202024',
          900: '#121214'
        },
        green: {
          300: '#00b37e',
          400: '#1ea483',
          500: '#00875f'
        }
      },

      fontFamily: {
        'roboto': ['Roboto', 'sans-serif']
      }
    }
  },
  plugins: []
}
