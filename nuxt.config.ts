import { defineNuxtConfig } from 'nuxt/config';
import svgLoader from 'vite-svg-loader';

import OpenProps from 'open-props';

export default defineNuxtConfig({
  vite: {
    plugins: [svgLoader()],
  },
  css: ['@/styles/global.css'],
  build: {
    postcss: {
      postcssOptions: {
        plugins: {
          'postcss-jit-props': OpenProps,
        },
      },
    },
  },
});
