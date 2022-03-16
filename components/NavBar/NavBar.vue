<template>
  <nav class="nav">
    <div class="nav-left nav-left__item--pointer">
      <img src="/logo.png" height="56" width="56" alt="logo" />
    </div>
    <div class="nav-right">
      <a href="https://www.linkedin.com/in/binodnepali" target="_blank">
        <img
          class="nav-right__item nav-right__item--white nav-right__item--pointer"
          src="assets/icons/linkedin.svg"
          height="36"
          width="36"
          alt="linkedin"
        />
      </a>
      <a href="https://github.com/binodnepali" target="_blank">
        <img
          class="nav-right__item nav-right__item--white nav-right__item--pointer"
          src="assets/icons/github.svg"
          height="36"
          width="36"
          alt="github"
        />
      </a>
      <img
        class="nav-right__item nav-right__item--white nav-right__item--pointer"
        src="assets/icons/light_mode_black_48dp.svg"
        height="36"
        width="36"
        alt="theme mode"
      />
    </div>
  </nav>
</template>
<style lang="scss" scoped>
.nav {
  background-color: var(--orange-5);
  display: flex;
  min-height: var(--size-8);
}
.nav-left {
  flex-grow: 1;
}
.nav-left__item--pointer {
  cursor: pointer;
}
.nav-right {
  display: flex;
}
.nav-right__item {
  margin: var(--size-2);
}
.nav-right__item--white {
  filter: brightness(0) invert(1);
}
.nav-right__item--pointer {
  cursor: pointer;
}
</style>
