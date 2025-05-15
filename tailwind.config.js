/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3a3a3c",
        secondary: "#818384",
        correct: "#538d4e",
        present: "#b59f3b",
        absent: "#3a3a3c",
        keyboard: "#818384",
      },
    },
  },
  plugins: [],
}; 