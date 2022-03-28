<template>
  <slot />
</template>
<script setup lang="ts">
import { provide, ref, onMounted, onUnmounted } from 'vue';

import { ThemeMode } from '@/types/ThemeMode';

import { themeKey } from '@/constants/ProviderKeys';

const theme = ref(ThemeMode.Light);

const updateTheme = (themeMode: ThemeMode) => {
  theme.value = themeMode;
};

provide(themeKey, {
  theme,
  updateTheme,
});

const mediaQueryListEventChange = (
  mediaQueryListEvent: MediaQueryListEvent
) => {
  theme.value = mediaQueryListEvent.matches ? ThemeMode.Dark : ThemeMode.Light;
};

onMounted(() => {
  theme.value =
    (window.matchMedia('(prefers-color-scheme: dark)').matches &&
      ThemeMode.Dark) ||
    ThemeMode.Light;
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', mediaQueryListEventChange);
});
onUnmounted(() =>
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .removeEventListener('change', mediaQueryListEventChange)
);
</script>
