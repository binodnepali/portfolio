<template>
  <section class="skill">
    <h3>{{ techSkill.title }}</h3>
    <ul>
      <li v-for="(skill, i) in techSkill.skills" :key="i">{{ skill }}</li>
    </ul>
  </section>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'

import { TechSkill } from '../../types/tech-skill'

export default defineComponent({
  name: 'TechSkill',
  props: {
    techSkill: {
      type: Object as PropType<TechSkill>,
      required: true,
    },
  },
})
</script>

<style scoped>
.skill {
  margin: var(--size-4) 0;
}
</style>
