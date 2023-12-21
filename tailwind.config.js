/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  // darkMode: false,
  theme: {
    extend: {
      colors: {
        'regal-blue': '#53DCFF',
        'regal-yellow': '#FFBB00',
      },
    },
  },
  variants: {
    extend: {},
  },

  plugins: [],
};
