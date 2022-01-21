<template>
  <div>
    <linked-in-profile-badge />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import 'open-props/style'
import 'open-props/normalize'

import LinkedInProfileBadge from './components/LinkedInProfileBadge/LinkedInProfileBadge.vue'

export default defineComponent({
  name: 'App',
  components: {
    LinkedInProfileBadge,
  },
})
</script>
