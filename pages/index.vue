<template>
  <AppLayout>
    <template #main>
      <div class="profile">
        <my-profile />
      </div>
      <div class="bio">
        <my-bio />
      </div>
    </template>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/layouts/AppLayout.vue'
import MyProfile from '@/components/MyProfile/MyProfile.vue'
import MyBio from '@/components/MyBio/MyBio.vue'
</script>

<style lang="scss" scoped>
.profile {
  display: flex;
  width: auto;
  height: 100%;
  justify-content: center;
}

.bio {
  display: flex;
  justify-content: center;
  margin-top: var(--size-4);
}
</style>
