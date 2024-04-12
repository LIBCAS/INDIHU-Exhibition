/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#d2a473",
        secondary: "#1c3970",
        blue: "#2298ee",
        success: "#35c07d",
        warning: "#ffb347",
        danger: "#e0293e",

        // figma colors, muted-400 kept from previous usages
        white: "#ffffff",
        "light-gray": "#e9ecef",
        "medium-gray": "#ced4da",
        "muted-400": "#a6acb3",
        gray: "#6c757d", // e.g gray text for infopoints, background for tags in dark mode
        "dark-gray": "#343a40",
        black: "#121416",

        background: "#393d41",

        // Theme (colors from figma)
        "dark-mode-b": "#202326", // background color in dark mode
        "light-mode-b": "#ffffff", // background color in light mode (white)
        "dark-mode-f": "#ffffff", // text (foreground) color in dark mode (white text on dark background)
        "light-mode-f": "#121416", // text (foreground) color in light mode (black text on light background)

        // others
        "disabled-dark": "rgba(0, 0, 0, 0.26)",
        "disabled-light": "rgba(0, 0, 0, 0.12)",

        //
        "primary-blue": "#142E54;",
      },
      zIndex: {
        45: 45,
        100: 100,
      },
      screens: {
        // Backward compatibility for old expo administration screens
        desktop: "801px",
      },
      fontFamily: {
        inter: ['"Inter"', '"sans-serif"'],
      },
    },
  },
  plugins: [],
};
