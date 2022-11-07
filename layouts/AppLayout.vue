<template>
  <div>
    <Html lang="en-GB">
      <Head>
        <Title>Binod Nepali - Frontend Software Engineer</Title>
        <Meta
          name="description"
          content="I am a full-time Frontend Software Engineer and fond of working with Javascript frameworks. I mostly love working with React (a UI library), Vue, Next.js and Nuxt.js frameworks. I am also quite familiar (working) with the Javascript backend frameworks such as Express.js and GraphQL. Always enthusiastic about new web trends. And try to make time to learn and gets my hands dirty."
        />
      </Head>
    </Html>

    <header>
      <NavBar />
    </header>

    <MainLayout>
      <slot name="main" />
    </MainLayout>
  </div>
</template>
<script setup lang="ts">
import NavBar from '@/components/NavBar/NavBar.vue';
import MainLayout from '@/layouts/MainLayout.vue';
</script>
