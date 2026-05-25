/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Syne', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Clash Display', 'Syne', 'sans-serif'],
      },
      colors: {
        obsidian: {
          50: '#f0f0f5',
          100: '#e0e0eb',
          200: '#c1c1d6',
          300: '#9191b8',
          400: '#636394',
          500: '#3d3d70',
          600: '#2d2d58',
          700: '#1e1e3f',
          800: '#13132b',
          900: '#0a0a18',
          950: '#05050e',
        },
        neon: {
          cyan: '#00f5ff',
          purple: '#9b5de5',
          pink: '#f72585',
          green: '#4cc9f0',
          yellow: '#ffe66d',
        },
        surface: {
          DEFAULT: '#111128',
          elevated: '#1a1a35',
          border: '#2a2a4a',
          hover: '#222245',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh': 'radial-gradient(at 40% 20%, hsla(228,100%,74%,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,0.05) 0px, transparent 50%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'slide-in': 'slideIn 0.3s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: 0, transform: 'translateX(-20px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 245, 255, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 245, 255, 0.6), 0 0 40px rgba(0, 245, 255, 0.2)' },
        },
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 245, 255, 0.4)',
        'neon-purple': '0 0 15px rgba(155, 93, 229, 0.4)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'elevated': '0 8px 48px rgba(0, 0, 0, 0.6)',
      }
    },
  },
  plugins: [],
}
