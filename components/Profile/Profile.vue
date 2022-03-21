<template>
  <div class="card">
    <img
      class="card-img"
      src="/profile.webp"
      height="240"
      width="240"
      alt="profile"
    />
    <div class="card-text">
      <p class="card-text__item">Binod Nepali</p>
      <p class="card-text__item">27 years old | Nepalese</p>
      <p class="card-text__item">Frontend Software Engineer | adidas</p>
      <p class="card-text__item">Sittard-Geleen, Netherlands</p>
    </div>
  </div>
</template>
<style lang="sass" scoped>
.card
  width: 400px
  box-shadow: var(--shadow-3)
  padding: var(--size-2)

.card-img
  margin-left: auto
  margin-right: auto

.card-text
  text-align: center

.card-text__item
  margin: var(--size-2)  0
</style>
