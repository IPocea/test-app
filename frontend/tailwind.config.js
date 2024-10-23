/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        neutral: {
          50: "#f9fafb",
          100: "#f9fafb",
          200: "#eeeeee",
          300: "#ccccce",
          500: "#939295",
        },
        primary: {
          DEFAULT: "#524f9e",
          50: "#FAFAFD",
          100: "#EEEDF7",
          200: "#BAB8E0",
          300: "#7470C2",
          500: "#524f9e",
          700: "#474299",
        },
        body: "#595959",
        heading: "#151527",
        stroke: "#DFE4EA",
        gold: "#ffe07d",
        accent: {
          DEFAULT: "#ffe07d",
          200: "#fff3ce",
          500: "#ffe07d",
        },
        sand: "#e8e3d4",
        red: {
          100: "#FFE6E8",
          500: "#DC3545",
        },
        green: {
          100: "#d1fae7",
          400: "#29CC6A",
          500: "#13b168",
        },
        orange: {
          500: "#ea9b39",
        },

        secondary: {
          DEFAULT: "#080812",
          50: "#EEEEEE",
          300: "#595959",
          500: "#151527",
        },
        success: {
          DEFAULT: "#13B168",
          50: "#D1FAE7",
        },
        error: {
          DEFAULT: "#DC3545",
          50: "#FFE6E8",
        },
        "error-red": {
          DEFAULT: "#DC3545",
          300: "#FFE6E8",
        },
        "custom-yellow": {
          DEFAULT: "#f1c232",
          100: "#FFF3CE",
          300: "#FBE08B",
          350: "#FFE07D",
        },
        "custom-green": {
          DEFAULT: "#13B168",
          300: "#D1FAE7",
        },
        "custom-orage": {
          DEFAULT: "#EA9B39",
        },
        "custom-white": {
          DEFAULT: "#F9FAFB",
          700: "#EEEEEE",
        },
        "custom-gray": {
          DEFAULT: "#CCCCCE",
          100: "#F9FAFB",
        },
        "shade-of-gray": {
          DEFAULT: "#dee2e6",
        },
      },
    },
  },
  plugins: [],
};
