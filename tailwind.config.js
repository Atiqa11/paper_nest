/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // PaperNest Brand Palette
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        mint: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        sage: {
          50: '#f6f8f6',
          100: '#ebf1ec',
          200: '#d7e4d9',
          300: '#b7d0bd',
          400: '#92b59b',
          500: '#72997c',
          600: '#587c61',
          700: '#46624d',
          800: '#394e3e',
          900: '#2f4134',
          950: '#19241c',
        },
        aqua: {
          50: '#f0fdfa',
          100: '#e0f9f8',
          200: '#bbf2ef',
          300: '#86e5e0',
          400: '#44cfc9',
          500: '#1bb5af',
          600: '#12938e',
          700: '#137572',
          800: '#145e5d',
          900: '#154e4d',
          950: '#072e2e',
        },
        emeraldDark: {
          800: '#064e3b',
          850: '#053e30',
          900: '#022c22',
          950: '#011c15',
        },
        paper: {
          cream: '#fdfbf7',
          parchment: '#f8faf7',
          card: '#f4f8f5',
          border: '#e2ece5',
          darkBg: '#042723',
          darkCard: '#08332e',
          darkBorder: '#124c43',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'book': '0 8px 24px -4px rgba(15, 118, 110, 0.15)',
        'book-hover': '0 16px 32px -4px rgba(15, 118, 110, 0.25)',
        'book-dark': '0 8px 24px -4px rgba(0, 0, 0, 0.5)',
        'glow-teal': '0 0 25px -5px rgba(20, 184, 166, 0.4)',
        'glow-mint': '0 0 25px -5px rgba(52, 211, 153, 0.4)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
