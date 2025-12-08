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
        primary: {
          DEFAULT: '#A67C52',  // Warm bronze/tan - elegant and earthy
          hover: '#8B6844',    // Darker for hover
          light: '#C4A484',    // Lighter for dark mode
          dark: '#7A5C3E',     // Darker variant
        },
        // Secondary colors for landing page (beige/taupe accent)
        secondary: {
          DEFAULT: '#9F8170', // Beaver/Taupe/Beige - elegant accent
          light: '#C4A492',
          dark: '#7D6354',
        },
        // Warm dark mode background colors that complement bronze
        surface: {
          dark: '#1C1917',      // stone-900 - main dark bg
          darker: '#292524',    // stone-800 - secondary dark bg
          muted: '#44403C',     // stone-700 - hover/borders
          border: '#57534E',    // stone-600 - borders
        },
        // Warm light mode colors - sandy/cream palette
        cream: {
          50: '#FEFDFB',        // Very light cream - main background
          100: '#FBF9F5',       // Light cream - cards/surfaces
          200: '#F5F1EA',       // Slightly darker - hover states
          300: '#EDE7DC',       // Borders/dividers
          400: '#DDD4C4',       // Muted text backgrounds
          500: '#C9BBA6',       // Placeholder/muted elements
        },
        text: {
          dark: '#3D3229',      // Warm dark brown for text
          medium: '#5C4D3C',    // Medium brown
          light: '#8B7355',     // Light brown
          muted: '#A69580',     // Muted brown
          lighter: '#B8A994',   // Even lighter brown for landing
        },
        background: {
          DEFAULT: '#FEFDFB',  // Warm cream background
          card: '#FBF9F5',     // Card background
          hover: '#F5F1EA',    // Hover state
          white: '#FFFFFF',    // Pure white
          beige: '#F5F5DC',    // Beige for landing page
        },
        border: {
          DEFAULT: '#EDE7DC',  // Warm border
          input: '#DDD4C4',    // Input border
        },
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
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
          '0%, 100%': { boxShadow: '0 0 5px rgba(166, 124, 82, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(166, 124, 82, 0.6)' },
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
