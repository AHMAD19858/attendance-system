module.exports = {
  darkMode: "class",

  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--primary) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        dark: "rgb(var(--dark) / <alpha-value>)",
        grey: "rgb(var(--grey) / <alpha-value>)",
        secondary: "rgb(var(--secondary) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
        info: "rgb(var(--info) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        dark: "rgb(var(--dark) / <alpha-value>)",
        light: "rgb(var(--light) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
      },
      fontFamily: {
        primary: ["M PLUS Rounded 1c"],
        primaryBold: ["var(--main-font-bold)"],
        primarythin: ["var( --main-font-thin)"],
        primaryRegular: ["var( --main-font-regular)"],
        primaryMedium: ["var( --main-font-medium)"],
        primaryLight: ["var( --main-font-light)"],

        headers: ["Belgrano"]
      },
      animation: {
        fade: "fade 0.4s ease-in-out",
        slideDown: "slideDown 1s ease-in",
        spin: "spin 1s linear infinite",
      },
      keyframes: {
        fade: {
          "0%": {
            scale: 0,
            opacity: 0,
          },
          "100%": {
            opacity: 1,
            scale: 1,
          },
        },
        slideDown: {
          "0%": {
            transform: "translateY(-70px)",
            opacity: 0,
          },
          "100%": {
            transform: "translateY(0)",
            opacity: 1,
          },
        },
      },
    },
  },
};
