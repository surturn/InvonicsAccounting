/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#FDFBF7',      
          surface: '#FFFFFF',   
          elevated: '#F4EFE6',  
          border: '#E5E7EB',
          inverse: '#1A2922'
        },
        text: {
          primary: '#2A2A2A',
          secondary: '#6B7280',
          muted: '#9CA3AF',
          inverse: '#FFFFFF'
        },
        accent: {
          DEFAULT: '#C25934',   
          hover: '#A84A2A',
          subtle: '#C2593415'   
        },
        danger: {
          DEFAULT: '#DC2626',
          subtle: '#DC262615'
        },
        warning: {
          DEFAULT: '#D97706',
          subtle: '#D9770615'
        }
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      fontFamily: { 
        sans: ['Inter', 'sans-serif'] 
      }
    },
  },
  plugins: [],
}
