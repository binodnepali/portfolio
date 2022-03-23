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
      <h3 class="card-content__item card-content__item--title">Binod Nepali</h3>
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
<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  dark?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  dark: false,
});

const isDark = ref(props.dark);
watch(
  () => props.dark,
  (newVal) => {
    isDark.value = newVal;
  }
);
</script>
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
