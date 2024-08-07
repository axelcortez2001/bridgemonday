const { nextui } = require("@nextui-org/react");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      transitionProperty: {
        height: "height",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "a-blue": "#32449C",
        "a-orange": "#EF8B16",
        "a-green": "#01C875",
        "a-red": "#E2445B",
        "a-white": "#F9F9F9",
        "a-black": "#393939",
        "a-grey": "#D9D9D9",
        "a-darkgrey": "#C2C2C2",
      },
      fontFamily: {
        helvetica: ["helvetica", "sans"],
      },
    },
    screens: {
      xs: "375px",
      ss: "425px",
      sm: "768px",
      md: "1024px",
      lg: "1440px",
      xl: "2560px",
    },
  },
  darkMode: "class",

  plugins: [nextui()],
};
