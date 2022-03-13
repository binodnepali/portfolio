import { defineNuxtConfig } from 'nuxt3';

import postcssOptions from './postcss.config';

export default defineNuxtConfig({
  css: ['@/styles/global.css'],
  build: {
    postcss: {
      postcssOptions,
    },
  },
});
