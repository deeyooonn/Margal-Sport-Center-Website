
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
        body: ['Inter', '"Segoe UI"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-pastel': 'linear-gradient(135deg, var(--tw-gradient-stops))',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
