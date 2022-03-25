<template>
  <slot />
</template>
<script setup lang="ts">
import { provide, ref, watch } from 'vue';

import { useTheme } from '@/composables/useTheme';

import { ThemeMode } from '@/types/ThemeMode';

import { themeKey } from '@/constants/ProviderKeys';

const { isDark } = useTheme();

watch(isDark, (newVal) => {
  theme.value = newVal ? ThemeMode.Dark : ThemeMode.Light;
});

const theme = ref(isDark.value ? ThemeMode.Dark : ThemeMode.Light);

const updateTheme = (isDark: Boolean) => {
  theme.value = isDark ? ThemeMode.Dark : ThemeMode.Light;
};

provide(themeKey, {
  theme,
  updateTheme,
});
</script>
