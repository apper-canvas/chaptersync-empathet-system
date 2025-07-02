/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
theme: {
    extend: {
      colors: {
        primary: '#1E40AF',
        secondary: '#7C3AED',
        accent: '#0D9488',
        surface: '#F8FAFC',
        background: '#F1F5F9',
        success: '#059669',
        warning: '#D97706',
        error: '#DC2626',
        info: '#4F46E5',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Merriweather', 'serif'],
      },
      fontSize: {
        'xs': '0.8rem',
        'sm': '0.9rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.563rem',
        '3xl': '1.953rem',
        '4xl': '2.441rem',
        '5xl': '3.052rem',
      },
      backgroundImage: {
        'paper-texture': "url('data:image/svg+xml,<svg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"none\" fill-rule=\"evenodd\"><g fill=\"%23FFF8DC\" fill-opacity=\"0.3\"><circle cx=\"7\" cy=\"7\" r=\"1\"/><circle cx=\"53\" cy=\"53\" r=\"1\"/><circle cx=\"35\" cy=\"20\" r=\"1\"/><circle cx=\"20\" cy=\"35\" r=\"1\"/></g></svg>')",
        'wood-grain': "url('data:image/svg+xml,<svg width=\"100\" height=\"20\" viewBox=\"0 0 100 20\" xmlns=\"http://www.w3.org/2000/svg\"><defs><pattern id=\"wood\" x=\"0\" y=\"0\" width=\"100\" height=\"20\" patternUnits=\"userSpaceOnUse\"><rect width=\"100\" height=\"20\" fill=\"%238B4513\"/><path d=\"M0 10q25-5 50 0t50 0v10q-25 5-50 0t-50 0z\" fill=\"%23654321\" opacity=\"0.3\"/></pattern></defs><rect width=\"100\" height=\"20\" fill=\"url(%23wood)\"/></svg>')",
      },
      boxShadow: {
        'paper': '0 2px 8px rgba(139, 69, 19, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
        'paper-hover': '0 4px 12px rgba(139, 69, 19, 0.15), 0 2px 6px rgba(0, 0, 0, 0.1)',
        'book': '0 8px 32px rgba(139, 69, 19, 0.2), 0 4px 16px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'typewriter': 'typewriter 0.8s steps(40) forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'bounce-gentle': 'bounceGentle 0.6s ease-out',
      },
      keyframes: {
        typewriter: {
          '0%': { width: '0' },
          '100%': { width: '100%' }
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        bounceGentle: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-10px)' },
          '60%': { transform: 'translateY(-5px)' }
        }
      }
    },
  },
  plugins: [],
}