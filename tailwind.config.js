/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0D6EFD',
          hover: '#0B5ED7',
          light: '#3D8BFD', // For dark mode
        },
        text: {
          dark: '#212529',
          medium: '#495057',
          light: '#ADB5BD',
          muted: '#757575',
        },
        background: {
          DEFAULT: '#F4F7F6',
          white: '#FFFFFF',
        },
        border: {
          DEFAULT: '#E5E7EB',
          input: '#94979A',
        },
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      spacing: {
        'xs': 'var(--spacing-xs)',
        'sm': 'var(--spacing-sm)',
        'md': 'var(--spacing-md)',
        'lg': 'var(--spacing-lg)',
        'xl': 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
      },
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-once': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { opacity: '0.6' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0.6' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        'scale-in': {
          'from': { opacity: '0', transform: 'scale(0.95)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
        'smooth-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(13, 110, 253, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(13, 110, 253, 0.6)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'pulse-once': 'pulse-once 0.3s ease-out',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'ripple': 'ripple 0.6s linear',
        'scale-in': 'scale-in 0.2s ease-out',
        'smooth-bounce': 'smooth-bounce 0.4s ease-in-out',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
