<template>
  <div>
    <layout-default>
      <nav-bar :dark="isDark" />
    </layout-default>
    <main>
      <div class="profile-container">
        <profile />
      </div>
      <div class="bio-container">
        <bio />
      </div>
    </main>
  </div>
</template>

<script setup>
import LayoutDefault from '@/layouts/LayoutDefault.vue';
import NavBar from '@/components/NavBar/NavBar.vue';
import Profile from '@/components/Profile/Profile.vue';
import Bio from '@/components/Bio/Bio.vue';

import { useTheme } from '@/composables/useTheme';

const { isDark } = useTheme();
</script>

<style lang="sass" scoped>
main
  padding: var(--size-2)

.profile-container
  display: flex
  justify-content: center

.bio-container
  display: flex
  justify-content: center
  margin-top: var(--size-4)
</style>
