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
      <p class="card-text__item card-text__item--title">Binod Nepali</p>
      <p class="card-text__item card-text__item--subtitle1">
        27 years old | Nepalese
      </p>
      <p class="card-text__item card-text__item--subtitle">
        Frontend Software Engineer @ adidas
      </p>
      <p class="card-text__item card-text__item--subtitle">
        Sittard-Geleen, Netherlands
      </p>
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

.card-text__item--title
  font-weight: var(--font-weight-7)
  font-size: var(--font-size-4)

.card-text__item--subtitle
  font-weight: var(--font-weight-4)
  font-size: var(--font-size-2)

.card-text__item--subtitle1
  font-weight: var(--font-weight-1)
  font-size: var(--font-size-2)
</style>
