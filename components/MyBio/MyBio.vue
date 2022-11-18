<template>
  <div class="card">
    <div class="content">
      <h3 class="title">Bio</h3>
      <p class="body">
        I am a full-time Frontend Software Engineer and fond of working with
        Javascript frameworks. I mostly love working with React (a UI library),
        Vue, Next.js and Nuxt.js frameworks. I am also quite familiar (working)
        with the Javascript backend frameworks such as Express.js and GraphQL.
        Always enthusiastic about new web trends. And try to make time to learn
        and gets my hands dirty.
      </p>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.card {
  width: 640px;
}

.content {
  padding: var(--size-4);
}

.title {
  color: inherit;
  font-size: var(--font-size-4);
  font-weight: var(--font-weight-7);
}

.body {
  font-size: var(--font-size-2);
  font-weight: var(--font-weight-4);
  letter-spacing: var(--font-letterspacing-1);
}
</style>
