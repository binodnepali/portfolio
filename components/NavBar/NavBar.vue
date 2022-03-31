<template>
  <nav class="nav" :class="!isDark ? 'nav--light' : 'nav--dark'">
    <div class="nav-left">
      <icon-button
        :icon="{
          src: !isDark ? '/logo-light.png' : '/logo-dark.png',
          height: 56,
          width: 56,
          alt: 'Logo',
        }"
        :dark="isDark"
      />
    </div>
    <div class="nav-right">
      <icon-link
        class="nav-right__item"
        href="https://www.linkedin.com/in/binodnepali"
        target="_blank"
        :icon="{
          src: !isDark
            ? '/icons/light/linkedin.svg'
            : '/icons/dark/linkedin.svg',
          height: 36,
          width: 36,
          alt: 'linkedin',
        }"
      />
      <icon-link
        class="nav-right__item"
        href="https://github.com/binodnepali/portfolio"
        target="_blank"
        :icon="{
          src: !isDark ? '/icons/light/github.svg' : '/icons/dark/github.svg',
          height: 36,
          width: 36,
          alt: 'github',
        }"
      />

      <icon-button
        v-if="!isDark"
        class="nav-right__item"
        :dark="isDark"
        :icon="{
          src: '/icons/dark/dark_mode.svg',
          height: 36,
          width: 36,
          alt: 'theme mode',
        }"
        :handleOnClick="handleOnThemeDarkMode"
      />
      <icon-button
        v-else
        class="nav-right__item"
        :dark="isDark"
        :icon="{
          src: '/icons/light/light_mode.svg',
          height: 36,
          width: 36,
          alt: 'theme mode',
        }"
        :handleOnClick="handleOnThemeLightMode"
      />
    </div>
  </nav>
</template>
<script setup lang="ts">
import { ThemeMode } from '@/types/ThemeMode';

import '@/components/IconButton/IconButton.vue';
import '@/components/IconLink/IconLink.vue';

import { useTheme } from '@/composables/useTheme';

const { isDark, updateTheme } = useTheme();

const handleOnThemeLightMode = () => {
  updateTheme(ThemeMode.Light);
};

const handleOnThemeDarkMode = () => {
  updateTheme(ThemeMode.Dark);
};
</script>
<style lang="sass" scoped>
.nav
  display: flex
  min-height: var(--size-8)
  box-shadow: var(--shadow-3)

.nav--light
  background-color: var(--primary-color)

.nav--dark
  background-color: var(--primary-dark-color)
  border-bottom: var(--border-size-1) solid var(--gray-8)
  box-shadow: 100px 60px

.nav-left
  flex-grow: 1

.nav-right
  display: flex

.nav-right__item
  margin: var(--size-2)
</style>
