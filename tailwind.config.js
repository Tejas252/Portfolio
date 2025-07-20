// tailwind.config.js
module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      keyframes: {
        reveal: {
          "0%": { transform: "scale(0)" },
          "100%": { transform: "scale(50)" }, // Enough to cover screen
        },
      },
      animation: {
        "theme-reveal": "reveal 1s ease-out",
      },
    },
  },
  plugins: [],
};
