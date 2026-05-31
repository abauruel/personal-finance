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
          DEFAULT: '#6366f1',
          light: '#818cf8',
          dark: '#4f46e5',
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        success: {
          DEFAULT: '#10b981',
          light: '#34d399',
          dark: '#059669',
        },
        error: {
          DEFAULT: '#ef4444',
          light: '#f87171',
          dark: '#dc2626',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
          dark: '#d97706',
        },
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'sm': '0 1px 3px rgba(0, 0, 0, 0.06)',
        'md': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'lg': '0 8px 16px rgba(0, 0, 0, 0.06)',
        'xl': '0 16px 32px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        'card': '16px',
        'button': '12px',
      },
      spacing: {
        'card': '24px',
      },
    },
  },
  plugins: [],
}
