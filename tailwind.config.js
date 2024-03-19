/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  // darkMode: false,
  theme: {
    extend: {
      screens: {
        medium: '850px',
        // => @media (min-width: 576px) { ... }
      },
      rotate: {
        90: '90deg',
      },
      colors: {
        'regal-blue': '#53DCFF',
        'regal-yellow': '#FFBB00',
        'regal-purple': '#B75BFF',
      },
    },
  },
  variants: {
    extend: {},
  },

  plugins: [],
};
