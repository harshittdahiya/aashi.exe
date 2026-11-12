/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'off-white': '#F7F6EF',
        'sage': '#A8B99A',
        'sage-dark': '#7a9068',
        'butter': '#F5DF8B',
        'butter-dark': '#e8c94a',
        'ink': '#34382F',
        'secondary': '#747568',
      },
      fontFamily: {
        'display': ['"Fredoka One"', 'cursive'],
        'body': ['"Nunito"', 'sans-serif'],
        'handwritten': ['"Caveat"', 'cursive'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'sway': 'sway 4s ease-in-out infinite',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
        'swim': 'swim 3s ease-in-out infinite',
        'bubble': 'bubble 2s ease-in-out infinite',
        'petal-fall': 'petalFall 4s ease-in forwards',
        'bloom': 'bloom 0.5s ease-out forwards',
        'shake': 'shake 0.5s ease-in-out',
        'pop-in': 'popIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
        'charge': 'charge 1.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%': { transform: 'rotate(5deg)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        swim: {
          '0%, 100%': { transform: 'translateX(0px) scaleX(1)' },
          '25%': { transform: 'translateX(20px) scaleX(1)' },
          '50%': { transform: 'translateX(0px) scaleX(-1)' },
          '75%': { transform: 'translateX(-20px) scaleX(-1)' },
        },
        bubble: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(-40px) scale(1.5)', opacity: '0' },
        },
        petalFall: {
          '0%': { transform: 'translateY(-20px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
        bloom: {
          '0%': { transform: 'scale(0) rotate(-10deg)', opacity: '0' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-10px)' },
          '40%': { transform: 'translateX(10px)' },
          '60%': { transform: 'translateX(-8px)' },
          '80%': { transform: 'translateX(8px)' },
        },
        popIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        charge: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        }
      }
    },
  },
  plugins: [],
}
