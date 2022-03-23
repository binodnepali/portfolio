<template>
  <button
    :class="!dark ? 'button--light' : 'button--dark'"
    @click="handleOnClick"
  >
    <img
      :src="icon.src"
      :height="icon.height"
      :width="icon.width"
      :alt="icon.alt"
    />
  </button>
</template>
<script setup lang="ts">
import { Icon } from '@/types/Icon';

interface Props {
  icon: Icon;
  dark?: boolean;
  handleOnClick?: () => void;
}
defineProps<Props>();
</script>
<style lang="sass" scoped>
.button--light
  background: var(--primary-color)

.button--dark
  background: var(--primary-dark-color)
</style>
