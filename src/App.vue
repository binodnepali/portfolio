<template>
  <div>
    <the-header />
    <main>
      <section>
        <h2>Hello there, It's me Binod 👋</h2>
        <h3>I am a fulltime Frontend Developer and Single 🤣</h3>
      </section>
      <hr />
      <section>
        <h2>Skills</h2>
        <tech-skill
          v-for="(techSkill, i) in techSkills"
          :key="i"
          :tech-skill="techSkill"
        />
      </section>
    </main>
    <the-footer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import TheHeader from './components/TheHeader/TheHeader.vue'
import TheFooter from './components/TheFooter/TheFooter.vue'
import TechSkill from './components/TechSkill/TechSkill.vue'

export default defineComponent({
  name: 'App',
  components: {
    TheHeader,
    TheFooter,
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
