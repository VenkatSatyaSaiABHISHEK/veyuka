/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#FBFAF8',
        'canvas-pure': '#FFFFFF',
        'canvas-subtle': '#F7F5F2',
        'canvas-card': '#FFFFFF',
        ink: {
          DEFAULT: '#121016',
          secondary: '#4A4553',
        },
        grey: {
          DEFAULT: '#8B8794',
          light: '#B8B4BF',
        },
        hairline: {
          DEFAULT: '#ECE8E4',
          light: '#F4F1ED',
        },
        plum: {
          DEFAULT: '#4A2275',
          hover: '#3A1860',
          subtle: 'rgba(74, 34, 117, 0.08)',
        },
        gold: {
          DEFAULT: '#B8924A',
          subtle: 'rgba(184, 146, 74, 0.16)',
        },
        status: {
          success: '#2E7D32',
          'success-bg': 'rgba(46, 125, 50, 0.08)',
          warning: '#ED6C02',
          'warning-bg': 'rgba(237, 108, 2, 0.08)',
          error: '#D32F2F',
          'error-bg': 'rgba(211, 47, 47, 0.08)',
          info: '#0288D1',
          'info-bg': 'rgba(2, 136, 209, 0.08)',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        xs: '6px',
        sm: '10px',
        md: '14px',
        lg: '18px',
        xl: '22px',
        '2xl': '28px',
        photo: '28px',
        card: '24px',
      },
      boxShadow: {
        floating: '0 12px 36px -4px rgba(18, 16, 22, 0.08), 0 4px 12px -2px rgba(18, 16, 22, 0.03)',
        card: '0 4px 20px -2px rgba(18, 16, 22, 0.04)',
        subtle: '0 2px 8px -1px rgba(18, 16, 22, 0.03)',
        drawer: '-16px 0 48px -8px rgba(18, 16, 22, 0.12)',
        palette: '0 24px 64px -12px rgba(18, 16, 22, 0.14)',
      },
      spacing: {
        '4.5': '1.125rem',
      },
    },
  },
  plugins: [],
};
