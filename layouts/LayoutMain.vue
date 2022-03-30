<template>
  <main style="height: 100vh" :class="{ 'main--dark': isDark }">
    <slot />
  </main>
</template>
<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';

const { isDark } = useTheme();
</script>

<style lang="sass" scoped>
.main--dark
  background-color: var(--primary-dark-color)
  color: var(--gray-1)
</style>
