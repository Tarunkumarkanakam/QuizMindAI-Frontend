/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '60px': '60px',
        '220px': '220px',
      },
      backdropBlur: {
        xs: '2px',
      },
      colors: {
        glass: 'rgba(255, 255, 255, 0.1)',
      },
      boxShadow: {
        'glow': '0 0 8px rgba(0, 123, 255, 0.8)'
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(20px)',
      },
    },
  },
  safelist: [
    'bg-yellow-300',
    'bg-amber-300',
    'border-yellow-400',
    'text-white',
    'font-bold'
  ],
  variants: {
    extend: {
      backdropBlur: ['hover', 'focus'],
    },
  },
  plugins: [],
}
