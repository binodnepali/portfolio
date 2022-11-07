<template>
  <nav class="nav">
    <div class="navLeft">
      <NuxtLink to="/" class="navLeftItem logo"> B.N </NuxtLink>
    </div>
    <div class="navRight">
      <NuxtLink
        to="https://www.linkedin.com/in/binodnepali"
        target="_blank"
        class="navRightItem"
      >
        <LinkedInIcon width="24" height="24" />
      </NuxtLink>

      <NuxtLink
        to="https://github.com/binodnepali/portfolio"
        target="_blank"
        class="navRightItem"
      >
        <GithubIcon width="24" height="24" />
      </NuxtLink>

      <button
        class="navRightItem themeToggle"
        title="toggles light & dark"
        @click="() => updateTheme(ThemeMode.Dark)"
        v-if="isLight"
      >
        <LightModeIcon width="24" height="24" />
      </button>
      <button
        class="navRightItem themeToggle"
        title="toggles light & dark"
        @click="() => updateTheme(ThemeMode.Light)"
        v-else
      >
        <DarkModeIcon width="24" height="24" />
      </button>
    </div>
  </nav>
</template>
<script setup lang="ts">
import GithubIcon from '@/assets/github.svg?component';
import LinkedInIcon from '@/assets/linkedin.svg?component';
import LightModeIcon from '@/assets/lightMode.svg?component';
import DarkModeIcon from '@/assets/darkMode.svg?component';

import { useTheme } from '@/composables/useTheme';
import { ThemeMode } from '~~/types/ThemeMode';

const { isLight, updateTheme } = useTheme();
</script>
<style lang="sass" scoped>
.nav
  display: flex
  align-items: center
  min-height: var(--size-8)
  box-shadow: var(--shadow-3)

.navLeft
  flex-grow: 1

  &Item
    margin: 0 var(--size-2)
    text-decoration: none
    font-size: 36px


.logo
  color: var(--brand)

.navRight
  display: flex

  &Item
    margin: var(--size-2)

.themeToggle
 background: none
</style>
