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
      <MainLayout>
        <slot name="main" />
      </MainLayout>
    </ThemeProvider>
  </div>
</template>
<script setup lang="ts">
import ThemeProvider from '@/components/ThemeProvider/ThemeProvider.vue';
import NavBar from '@/components/NavBar/NavBar.vue';
import MainLayout from '@/layouts/MainLayout.vue';
</script>
