import { Options } from "$fresh/plugins/twind.ts";

export default {
  selfURL: import.meta.url,
  theme: {
    screens: {
      xs: "360px",
      sm: "600px",
      md: "1024px",
      lg: "1280px",
      xl: "1366px",
      "2xl": "1920px",
    },
    colors: {
      white: "#fff",
      black: "#000",
      background: {
        "on-light": "#fff",
        "on-dark": "#121212",
      },
      "on-background": {
        "on-light": "#000",
        "on-dark": "#fff",
      },
      surface: {
        "on-light": "#fff",
        "on-dark": "#121212",
      },
      "on-surface": {
        "on-light": "#000",
        "on-dark": "#fff",
      },
      primary: {
        "on-light": {
          700: "#0091a7",
          500: "#06b5d4",
        },
        "on-dark": {
          700: "#0091a7",
          200: "#7fdaec",
        },
      },
      "on-primary": {
        "on-light": "#fff",
        "on-dark": "#000",
      },
      secondary: {
        "on-light": {
          900: "#d42506",
          200: "#ffab92",
        },
        "on-dark": {
          200: "#ffab92",
        },
      },
      "on-secondary": "#000",
      error: {
        "on-light": "#b00020",
        "on-dark": "#cf6679",
      },
      "on-error": {
        "on-light": "#fff",
        "on-dark": "#000",
      },
    },
  },
} as Options;
