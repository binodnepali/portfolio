<template>
  <div class="card">
    <img
      class="card-img"
      src="/profile.webp"
      height="240"
      width="240"
      alt="profile"
    />
    <div class="card-content">
      <p class="card-content__item card-content__item--title">Binod Nepali</p>
      <p class="card-content__item card-content__item--subtitle1">
        27 years old | Nepalese
      </p>
      <p class="card-content__item card-content__item--subtitle">
        Frontend Software Engineer @ adidas
      </p>
      <p class="card-content__item card-content__item--subtitle">
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

.card-content
  text-align: center

.card-content__item
  margin: var(--size-2)  0

.card-content__item--title
  font-weight: var(--font-weight-7)
  font-size: var(--font-size-4)

.card-content__item--subtitle
  font-weight: var(--font-weight-4)
  font-size: var(--font-size-2)

.card-content__item--subtitle1
  font-weight: var(--font-weight-3)
  font-size: var(--font-size-2)
</style>
