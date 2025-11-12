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
    },
  },
  plugins: [],
}
