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
        class="nav-right__item"
        :dark="isDark"
        :icon="{
          src: !isDark
            ? '/icons/light/light_mode.svg'
            : '/icons/dark/dark_mode.svg',
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
import { ref, watch } from 'vue';

import '@/components/IconButton/IconButton.vue';
import '@/components/IconLink/IconLink.vue';

interface Props {
  dark?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  dark: false,
});

const isDark = ref(props.dark);
watch(
  () => props.dark,
  (newVal) => {
    isDark.value = newVal;
  }
);
const handleOnThemeMode = () => {
  isDark.value = !isDark.value;
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

.nav-left
  flex-grow: 1

.nav-right
  display: flex

.nav-right__item
  margin: var(--size-2)
</style>
