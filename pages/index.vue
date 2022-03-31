<template>
  <AppLayout>
    <template #main>
      <div class="profile-container">
        <profile />
      </div>
      <div class="bio-container">
        <bio />
      </div>
    </template>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/layouts/AppLayout.vue';
import Profile from '@/components/Profile/Profile.vue';
import Bio from '@/components/Bio/Bio.vue';
</script>

<style lang="sass" scoped>

.main-light
  background-color: red

main
  padding: var(--size-2)

.profile-container
  display: flex
  justify-content: center
  padding-top: var(--size-4)

.bio-container
  display: flex
  justify-content: center
  margin-top: var(--size-4)
</style>
