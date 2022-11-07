<template>
  <div class="card">
    <img
      class="cardImg"
      src="/profile.webp"
      height="240"
      width="240"
      alt="profile"
    />
    <div class="cardContent">
      <h3 class="cardContentItem cardContentItemTitle">Binod Nepali</h3>
      <p class="cardContentItem cardContentItemSubtitle1">
        {{ age }} years old | Nepalese
      </p>
      <p class="cardContentItem cardContentItemSubtitle">
        Frontend Software Engineer @ adidas
      </p>
      <p class="cardContentItem cardContentItemSubtitle">
        Sittard-Geleen, Netherlands
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
const age = new Date().getFullYear() - 1995;
</script>
<style lang="sass" scoped>
.card
  width: 400px
  box-shadow: var(--shadow-3)
  padding: var(--size-2)

.cardImg
  margin-left: auto
  margin-right: auto

.cardContent
  text-align: center

.cardContentItem
  margin: var(--size-2)  0

.cardContentItemTitle
  font-weight: var(--font-weight-7)
  font-size: var(--font-size-4)
  color: inherit

.cardContentItemSubtitle
  font-weight: var(--font-weight-4)
  font-size: var(--font-size-2)

.cardContentItemSubtitle1
  font-weight: var(--font-weight-3)
  font-size: var(--font-size-2)
</style>
