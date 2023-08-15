/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#d2a473",
        secondary: "#1c3970",
        background: "#393d41",
        muted: "#6c757d",
        "muted-400": "#a6acb3",
        "muted-200": "#ced4da",
        "muted-100": "#dee4e9",
        blue: "#2298ee",
        success: "#35c07d",
        danger: "#e0293e",
        "disabled-dark": "rgba(0, 0, 0, 0.26)",
        "disabled-light": "rgba(0, 0, 0, 0.12)",

        gray: "#6c757d", // figma -- gray text for infopoints, tags gray background when dark mode, SAME as muted
        // THEME
        "dark-mode-b": "#202326", // figma - dark mode background black color..
        "light-mode-b": "#ffffff", // light mode white background when light theme is on
        "dark-mode-f": "#ffffff", // white text when on dark background
        "light-mode-f": "#000000", // classic black text on white background
      },
      zIndex: {
        45: 45,
        100: 100,
      },
      screens: {
        // Backward compatibility for old expo administration screens
        desktop: "801px",
      },
    },
  },
  plugins: [],
};
