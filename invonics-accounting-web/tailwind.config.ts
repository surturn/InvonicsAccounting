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
          base: '#0F1117',      
          surface: '#1A1D27',   
          elevated: '#21253A',  
          border: '#2E3250'     
        },
        text: {
          primary: '#F0F2F8',
          secondary: '#8B90A0',
          muted: '#555B7A'
        },
        accent: {
          DEFAULT: '#00C896',   
          hover: '#00A87E',
          subtle: '#00C89615'   
        },
        danger: {
          DEFAULT: '#EF4444',
          subtle: '#EF444415'
        },
        warning: {
          DEFAULT: '#F59E0B',
          subtle: '#F59E0B15'
        }
      },
      fontFamily: { 
        sans: ['Inter', 'sans-serif'] 
      }
    },
  },
  plugins: [],
}
