<template>
  <section class="skills">
    <h2>Skills</h2>
    <tech-skill
      v-for="(techSkill, i) in techSkills"
      :key="i"
      :tech-skill="techSkill"
    />
  </section>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

import TechSkill from '../TechSkill/TechSkill.vue'

export default defineComponent({
  components: {
    TechSkill,
  },
  data: () => ({
    techSkills: [
      {
        title: 'Foundation',
        skills: ['HTML', 'CSS', 'Javascript', 'Typescript'],
      },
      {
        title: 'Frontend',
        skills: ['React', 'Vue'],
      },
      {
        title: 'Fullstack',
        skills: ['Next.js', 'Nuxt.js'],
      },
    ],
  }),
})
</script>

<style scoped>
.skills {
  padding: var(--size-5);
}
</style>
