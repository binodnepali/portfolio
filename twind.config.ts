import { Options } from "$fresh/plugins/twind.ts";

export default {
  selfURL: import.meta.url,
  theme: {
    screens: {
      sm: "360px",
      md: "800px",
      lg: "1280px",
      xl: "1440px",
    },
    extend: {
      colors: {
        primary: "#f97316",
        secondary: "#16F973",
        accent: "#7316F9",
      },
    },
  },
} as Options;
