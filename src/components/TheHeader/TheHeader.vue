<template>
  <header>
    <nav>
      <ul>
        <li><a href="/"> Binod Nepali </a></li>
      </ul>
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
  background-color: var(--indigo-6);
  color: white;
}

nav ul {
  list-style: none;
}

nav a {
  color: white;
  text-decoration: none;
}

nav a:hover {
  color: white;
}
</style>
