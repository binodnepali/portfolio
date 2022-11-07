import { defineNuxtConfig } from 'nuxt/config';
import svgLoader from 'vite-svg-loader';

export default defineNuxtConfig({
  vite: {
    plugins: [svgLoader()],
  },
  css: ['@/styles/global.css'],
});
