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
  background-color: var(--indigo-9);
  color: white;
  display: flex;
  min-height: var(--size-fluid-5);
}
</style>
