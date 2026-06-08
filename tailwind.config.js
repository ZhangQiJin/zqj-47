/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        greenhouse: {
          green: "#4A7C59",
          "green-light": "#6B9E7A",
          "green-dark": "#3D6B3D",
          cream: "#F5F0E8",
          soil: "#8B6F47",
          sky: "#87CEEB",
          sunset: "#E8945A",
        },
      },
      fontFamily: {
        pixel: ['"ZCOOL QingKe HuangYou"', "cursive"],
        body: ['"Noto Sans SC"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
