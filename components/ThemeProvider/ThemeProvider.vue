<template>
  <slot />
</template>
<script setup lang="ts">
import { provide, ref } from 'vue';

import { useTheme } from '@/composables/useTheme';

import { ThemeMode } from '@/types/ThemeMode';

import { themeKey } from '@/constants/ProviderKeys';

const { isDark } = useTheme();
const theme = ref(isDark.value ? ThemeMode.Dark : ThemeMode.Light);

const updateTheme = (isDark: Boolean) => {
  theme.value = isDark ? ThemeMode.Dark : ThemeMode.Light;
};

provide(themeKey, {
  theme,
  updateTheme,
});
</script>
