/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#008938',
        primaryDark: '#006B2E',
        accent: '#FFC20D',
        accentDark: '#E8A900',
        surface: '#FFFFFF',
        surfaceAlt: '#F7F9F5',
        muted: '#6B7280',
        ink: '#122018',
        border: '#E3E9DF',
        danger: '#DC2626',
        warning: '#F59E0B',
        success: '#16A34A',
        info: '#2563EB',
        sidebar: '#062C1D',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '0.875rem' }],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        card: '0 14px 40px rgba(6, 44, 29, 0.08)',
        soft: '0 8px 24px rgba(18, 32, 24, 0.08)',
      },
    },
  },
  plugins: [],
}

