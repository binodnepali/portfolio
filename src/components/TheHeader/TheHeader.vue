<template>
  <header>
    <nav>
      <img src="../../assets/logo.png" height="48" width="48" />
    </nav>
  </header>
</template>
<script>
export default {
  name: 'TheHeader',
}
</script>
<style scoped>
header {
  display: flex;
  align-items: center;
  min-height: var(--size-fluid-5);
  background-color: white;
  box-shadow: var(--shadow-2);
}

nav {
  padding-top: var(--size-1);
  padding-bottom: var(--size-1);
  padding-left: var(--size-4);
}

nav img:hover {
  cursor: pointer;
}
</style>
