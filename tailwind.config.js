module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      keyframes: {
        float: {
          "0%, 100%": { transform: "translate(0px, 0px)" },
          "50%": { transform: "translate(40px, -40px)" },
        },
        imgFloat: {
          "50%": { transform: "translateY(-18px)" },
        },
        cardIntro: {
          "0%": {
            opacity: "0",
            transform: "translateY(20px) scale(0.9)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0) scale(1)",
          },
        },
        cartBounce: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.2)" },
        },
      },

      animation: {
        float: "float 18s ease-in-out infinite",
        imgFloat: "imgFloat 6s ease-in-out infinite",
        cardIntro: "cardIntro 0.9s ease forwards",
        cartBounce: "cartBounce 0.5s ease",
      },
    },
  },

  plugins: [],
};
