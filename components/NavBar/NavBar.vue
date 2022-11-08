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
        @click="() => updateTheme()"
      >
        <Transition mode="out-in" name="fadeModeIcon">
          <LightModeIcon v-if="isLight" width="24" height="24" />
          <DarkModeIcon v-else width="24" height="24" />
        </Transition>
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

const { isLight, updateTheme } = useTheme();
</script>
<style lang="sass" scoped>
.nav
  display: flex
  align-items: center
  min-height: var(--size-8)

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

.fadeModeIcon-enter-from,.fadeModeIcon-leave-to
  opacity: 0

.fadeModeIcon-enter-active
  transition: opacity 0.3s ease-out

.fadeModeIcon-leave-active
  transition: opacity 0.3s ease-in

.fadeModeIcon-enter-to,.fadeModeIcon-leave-from
  opacity: 1
</style>
