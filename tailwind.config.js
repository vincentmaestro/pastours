/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}",
],
  theme: {
    screens: {
      'desktop': {'max': '1535px'},

      'laptop_l': {'max': '1280px'},

      'laptop': {'max': '1024px'},

      'laptop_s': {'max': '992px'},

      'tablet': {'max': '768px'},

      'tablet_s': {'max': '640px'},

      'mobile': {'max': '425px'},

      'mobile_m': {'max': '375px'},

      'mobile_s': {'max': '320px'},
    },
    extend: {},
  },
  plugins: [],
}

