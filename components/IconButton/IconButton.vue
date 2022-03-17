<template>
  <button
    :class="!isDark ? 'button--light' : 'button--dark'"
    @click="handleOnThemeMode"
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
import { ref } from 'vue';

import { Icon } from '../../types/Icon';

interface Props {
  icon: Icon;
  dark?: boolean;
  handleOnClick?: (isDark: boolean) => {};
}
const { dark, handleOnClick } = defineProps<Props>();

const isDark = ref(dark);
const handleOnThemeMode = () => {
  isDark.value = !isDark.value;
  handleOnClick(isDark.value);
};
</script>
<style lang="scss" scoped>
.button--light {
  background: var(--primary-color);
}
.button--dark {
  background: var(--primary-dark-color);
}
</style>
