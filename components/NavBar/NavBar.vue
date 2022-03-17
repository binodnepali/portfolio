<template>
  <nav class="nav nav--light" :class="!isDark ? 'nav--light' : 'nav--dark'">
    <div class="nav-left nav-left__item--pointer">
      <icon-button
        :icon="{
          src: !isDark ? '/logo-light.png' : '/logo-dark.png',
          height: 56,
          width: 56,
          alt: 'Logo',
        }"
        :handleOnClick="() => {}"
      />
    </div>
    <div class="nav-right">
      <icon-link
        class="nav-right__item"
        href="https://www.linkedin.com/in/binodnepali"
        target="_blank"
        :icon="{
          src: !isDark
            ? 'assets/icons/light/linkedin.svg'
            : 'assets/icons/dark/linkedin.svg',
          height: 36,
          width: 36,
          alt: 'linkedin',
        }"
      />
      <icon-link
        class="nav-right__item"
        href="https://github.com/binodnepali"
        target="_blank"
        :icon="{
          src: !isDark
            ? 'assets/icons/light/github.svg'
            : 'assets/icons/dark/github.svg',
          height: 36,
          width: 36,
          alt: 'github',
        }"
      />
      <icon-button
        class="nav-right__item"
        :icon="{
          src: !isDark
            ? 'assets/icons/light/light_mode.svg'
            : 'assets/icons/dark/dark_mode.svg',
          height: 36,
          width: 36,
          alt: 'theme mode',
        }"
        :handleOnClick="handleOnThemeMode"
      />
    </div>
  </nav>
</template>
<script setup lang="ts">
import { ref } from 'vue';

import '@/components/IconButton/IconButton.vue';
import '@/components/IconLink/IconLink.vue';

const isDark = ref(false);
const handleOnThemeMode = (event) => {
  isDark.value = event;
};
</script>
<style lang="scss" scoped>
.nav {
  display: flex;
  min-height: var(--size-8);
}
.nav--light {
  background-color: var(--primary-color);
}
.nav--dark {
  background-color: var(--primary-dark-color);
}
.nav-left {
  flex-grow: 1;
}
.nav-left__item--pointer {
  cursor: pointer;
}
.nav-right {
  display: flex;
}
.nav-right__item {
  margin: var(--size-2);
}
.nav-right__item--white {
  filter: brightness(0) invert(1);
}
.nav-right__item--pointer {
  cursor: pointer;
}
</style>
