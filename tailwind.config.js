/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Your custom gradient palette
        theme: {
          50: '#a3c4e0',
          100: '#7aabb8',
          200: '#4d8a9b',
          300: '#2b6f7a',
          400: '#0e545e',
          500: '#0b4345',
          600: '#092e35',
          700: '#081e28',
          800: '#0a0e12',
          900: '#000000',
        },
      },
      backgroundImage: {
        'gradient-theme': 'linear-gradient(135deg, #a3c4e0 0%, #7aabb8 20%, #4d8a9b 40%, #2b6f7a 60%, #0e545e 80%, #000000 100%)',
        'gradient-radial': 'radial-gradient(circle at center, #a3c4e0 0%, #0e545e 50%, #000000 100%)',
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-position': 'left center',
          },
          '50%': {
            'background-position': 'right center',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': {
            'box-shadow': '0 0 20px rgba(163, 196, 224, 0.5)',
          },
          '100%': {
            'box-shadow': '0 0 40px rgba(163, 196, 224, 0.8)',
          },
        },
        shimmer: {
          '0%': { 'background-position': '-1000px 0' },
          '100%': { 'background-position': '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}