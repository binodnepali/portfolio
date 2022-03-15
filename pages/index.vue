<template>
  <div>
    <nav class="nav">
      <div class="nav-left">
        <img src="public/logo.png" height="56" width="56" alt="logo" />
      </div>
      <div class="nav-right">
        <img
          src="assets/icons/linkedin.svg"
          height="56"
          width="56"
          alt="linkedin"
        />
        <img
          src="assets/icons/github.svg"
          height="56"
          width="56"
          alt="github"
        />
        <img
          src="assets/icons/light_mode_black_48dp.svg"
          height="56"
          width="56"
          alt="github"
        />
      </div>
    </nav>
  </div>
</template>
<style lang="scss" scoped>
.nav {
  min-height: var(--size-8);
  display: flex;
  border: 1px dotted blue;
}
.nav-left {
  flex-grow: 1;
}
.nav-right {
  display: flex;
  border: 1px solid red;
}
</style>
