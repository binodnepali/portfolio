<template>
  <footer>
    <small>Version: {{ version }}</small>
  </footer>
</template>
<script lang="ts">
import { version } from '../../../package.json'
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'TheFooter',
  data() {
    return {
      version: '',
    }
  },
  mounted() {
    this.version = version
  },
})
</script>
<style scoped>
footer {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  color: var(--primary-color);
  padding: var(--size-3) 0;
}
</style>
