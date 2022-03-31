<template>
  <main style="height: 100vh" class="main" :class="{ 'main--dark': isDark }">
    <slot />
  </main>
</template>
<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';

const { isDark } = useTheme();
</script>

<style lang="sass" scoped>
.main
  background-color: var(--gray-0)
  color: var(--gray-7)

.main--dark
  background-color: var(--primary-dark-color)
  color: var(--gray-1)
</style>
