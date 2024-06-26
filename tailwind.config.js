/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        medium: '850px',
        lowerMobile: '406px',
        mobile: '450px',
      },
      rotate: {
        90: '90deg',
      },
      colors: {
        'regal-blue': '#53DCFF',
        'regal-yellow': '#FFBB00',
        'regal-purple': '#B75BFF',
      },
      maxHeight: {
        128: '32rem',
        160: '40rem',
        192: '48rem',
      },
      minHeight: {
        128: '32rem',
        160: '40rem',
        192: '48rem',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
