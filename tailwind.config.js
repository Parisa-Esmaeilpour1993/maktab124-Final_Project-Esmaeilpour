/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#328e6e",
        secondary: "#67ae6e",
        accent: "#90c67c",
        light: "#e1eebc",
      },
      boxShadow: {
        primary: "0px 16px 19px -2px rgba(225,0,0,0.75);",
      },
    },
  },
  plugins: [],
};
