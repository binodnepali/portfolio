<template>
  <div class="card">
    <img
      class="img"
      src="/profile.webp"
      height="240"
      width="240"
      alt="profile"
    />
    <div class="content">
      <h3 class="title">Binod Nepali</h3>
      <p class="subtitle1">{{ age }} years old | Nepalese</p>
      <p class="subtitle">Frontend Software Engineer @ adidas</p>
      <p class="subtitle">Sittard-Geleen, Netherlands</p>
    </div>
  </div>
</template>
<script setup lang="ts">
const age = new Date().getFullYear() - 1995
</script>
<style lang="scss" scoped>
.card {
  width: 400px;
  padding: var(--size-2);
}

.img {
  margin-right: auto;
  margin-left: auto;
}

.content {
  text-align: center;
}

.title {
  margin: var(--size-2) 0;
  font-size: var(--font-size-4);
  font-weight: var(--font-weight-7);
}

.subtitle {
  margin: var(--size-2) 0;
  font-size: var(--font-size-2);
  font-weight: var(--font-weight-4);
}

.subtitle1 {
  margin: var(--size-2) 0;
  font-size: var(--font-size-2);
  font-weight: var(--font-weight-3);
}
</style>
