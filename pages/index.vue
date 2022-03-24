<template>
  <div class="profile-container">
    <profile />
  </div>
  <div class="bio-container">
    <bio />
  </div>
</template>

<script setup>
import Profile from '@/components/Profile/Profile.vue';
import Bio from '@/components/Bio/Bio.vue';
</script>

<style lang="sass" scoped>
main
  padding: var(--size-2)

.profile-container
  display: flex
  justify-content: center
  margin-top: var(--size-4)

.bio-container
  display: flex
  justify-content: center
  margin-top: var(--size-4)
</style>
