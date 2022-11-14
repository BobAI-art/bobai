/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-blue-500": "#16162B",
        "light-blue-500": "#42DDE9",
        "purple-500": "#552F75",
        "site-pink-500": "#9723A7",
        "site-pink-600": "#7A1E8E",
        "yellow-500": "#FECF37",
        "site-gray-500": "#D9E8F0",
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
