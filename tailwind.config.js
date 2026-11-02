/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#05070E',
          card: '#0B0F19',
          cardBorder: '#1E293B',
          accent: '#00F0FF',
          accentGlow: 'rgba(0, 240, 255, 0.15)',
          purple: '#8B5CF6',
          indigo: '#6366F1',
          blue: '#3B82F6',
          emerald: '#10B981',
          rose: '#F43F5E',
          amber: '#F59E0B'
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(0, 240, 255, 0.3)',
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.3)',
        'glow-blue': '0 0 25px -5px rgba(59, 130, 246, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-light': '0 8px 32px 0 rgba(31, 38, 135, 0.08)',
      },
      backgroundImage: {
        'radial-gradient-dark': 'radial-gradient(circle at 50% 0%, rgba(30, 58, 138, 0.15) 0%, rgba(5, 7, 14, 0) 70%)',
        'metallic-card': 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.02) 100%)',
        'cyber-gradient': 'linear-gradient(135deg, #00F0FF 0%, #6366F1 50%, #A855F7 100%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
        shimmer: 'shimmer 2.5s infinite',
      }
    },
  },
  plugins: [],
}
