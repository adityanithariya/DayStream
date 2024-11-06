import type { Config } from 'tailwindcss'

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      backgroundColor: {
        primary: '#25272d',
        'primary-dark': '#111315',
        secondary: '#03b5fb',
      },
      borderColor: {
        secondary: '#03b5fb',
      },
      textColor: {
        primary: '#03B5FB',
      },
      colors: {
        light: '#19ECF0',
        dark: '#03B4FB',
        'light-blue': '#40dff6',
        'dark-blue': '#0eb1fb',
        'custom-blue': '#2bc5fa',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' },
        },
        'button-tap': {
          '0%': {
            backgroundColor: '#03B5FB30',
          },
          '100%': {
            backgroundColor: '#fff',
          },
        },
        verified: {
          '0%': {
            boxShadow: '0 0 7px 0 #03b5fb01',
          },
          '100%': {
            boxShadow: '0 0 7px 0 #03b5fb7a',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
        'button-tap': 'button-tap .1s ease-out',
        verified: 'verified .75s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config

export default config
