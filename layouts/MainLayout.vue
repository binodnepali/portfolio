<template>
  <main class="main" :class="{ 'main--dark': isDark }">
    <slot />
  </main>
</template>
<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';

const { isDark } = useTheme();
</script>

<style lang="sass" scoped>
@use '../styles/breakpoints.scss'
.main
  background-color: var(--gray-0)
  color: var(--gray-7)
  height: calc(100% - var(--header-height))
  padding: var(--size-4)

.main--dark
  background-color: var(--primary-dark-color)
  color: var(--gray-1)


@media (min-width: breakpoints.$breakpoint-tablet)
  .main
    height: calc(100vh - var(--header-height))
    padding-top: var(--size-4)
</style>
