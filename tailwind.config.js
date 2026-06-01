
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        pastel: {
          blue: {
            light: '#E0EAFC',
            DEFAULT: '#8BA6D6',
            dark: '#5A7BB5',
          },
          coral: {
            light: '#FAD4D6',
            DEFAULT: '#E88D91',
            dark: '#C66B70',
          },
          gold: {
            light: '#FDF1C4',
            DEFAULT: '#D4AF37',
            dark: '#C69214',
          }
        },
        brand: {
          navy: '#1A3673',
          red: '#C1272D',
          gold: '#C69214'
        }
      },
      fontFamily: {
        display: ['Oswald', 'sans-serif'],
        body: ['"Segoe UI"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-pastel': 'linear-gradient(135deg, var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
