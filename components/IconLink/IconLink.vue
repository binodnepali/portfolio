<template>
  <a :href="href" :target="target">
    <img
      :src="icon.src"
      :height="icon.height"
      :width="icon.width"
      :alt="icon.alt"
    />
  </a>
</template>
<script setup lang="ts">
import { Icon } from '@/types/Icon';

interface Props {
  href: string;
  target: string;
  icon: Icon;
}
defineProps<Props>();
</script>
