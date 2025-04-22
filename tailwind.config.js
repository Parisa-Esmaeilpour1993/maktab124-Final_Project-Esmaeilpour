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
        accent: "0px 3px 10px 1px rgba(10,50,10,0.4)",
        secondary: "0px 3px 10px 1px rgba(10,60,10,0.4)",
        primary: "0px 3px 10px 1px rgba(10,70,10,0.4)",
      },
      fontFamily: {
        vazir: ["Vazir", "sans-serif"],
      },
    },
  },
  plugins: [],
};
