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
    <ThemeProvider>
      <header>
        <NavBar />
      </header>
      <slot name="main" />
    </ThemeProvider>
  </div>
</template>
<script setup lang="ts">
import NavBar from '@/components/NavBar/NavBar.vue';
import ThemeProvider from '@/components/ThemeProvider/ThemeProvider.vue';
</script>
