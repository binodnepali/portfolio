<template>
  <div>
    <Html lang="en-GB">
      <Head>
        <Title>binodnepali.me</Title>
        <Meta
          name="description"
          content="Fulltime Frontend Software Engineer at adidas. Fond of working with javascript frameworks."
        />
      </Head>
      <Body lang="en-GB" />
    </Html>
    <header>
      <nav-bar :dark="isDark" />
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>
<script setup lang="ts">
import NavBar from '@/components/NavBar/NavBar.vue';

import { useTheme } from '@/composables/useTheme';

const { isDark } = useTheme();
</script>
