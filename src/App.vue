<template>
  <div>
    <the-header />
    <main>
      <p class="banner">I am working on...</p>
      <my-bio />
      <my-tech-skill />
    </main>
    <the-footer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import TheHeader from './components/TheHeader/TheHeader.vue'
import TheFooter from './components/TheFooter/TheFooter.vue'
import MyBio from './components/MyBio/MyBio.vue'
import MyTechSkill from './components/MyTechSkill/MyTechSkill.vue'

export default defineComponent({
  name: 'App',
  components: {
    TheHeader,
    TheFooter,
    MyBio,
    MyTechSkill,
  },
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Lato:ital@0;1&display=swap');

:root {
  --primary-color: #ff9800;
}

#app {
  font-family: Lato, 'Noto Sans', 'Open Sans', 'Helvetica Neue', sans-serif;
}

.banner {
  font-style: italic;
  color: red;
  margin: 1rem;
}
</style>
