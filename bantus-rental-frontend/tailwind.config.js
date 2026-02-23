/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bantus-dark": "#3A2A1A",
        "bantus-light": "#FBF5EE",
        "bantus-orange": "#F97316",
      },
    },
  },
  plugins: [],
};
