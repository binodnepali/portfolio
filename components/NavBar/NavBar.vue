<template>
  <nav class="nav">
    <div class="nav-left">
      <NuxtLink to="/" class="nav-left-item"> B.N </NuxtLink>
    </div>
    <div class="nav-right">
      <NuxtLink
        to="https://www.linkedin.com/in/binodnepali"
        target="_blank"
        class="nav-right-item"
      >
        <LinkedInIcon width="24" height="24" />
      </NuxtLink>

      <NuxtLink href="mailto:nepalibinod9@gmail.com">
        <EmailIcon class="email-icon" />
      </NuxtLink>

      <button
        class="theme-toggle"
        title="toggles light & dark"
        @click="() => updateTheme()"
      >
        <Transition mode="out-in" name="fade-mode-icon">
          <LightModeIcon v-if="isLight" width="24" height="24" />
          <DarkModeIcon v-else width="24" height="24" />
        </Transition>
      </button>

      <NuxtLink
        to="https://github.com/binodnepali/portfolio"
        target="_blank"
        class="nav-right-item"
      >
        <GithubIcon width="24" height="24" />
      </NuxtLink>
    </div>
  </nav>
</template>
<script setup lang="ts">
import EmailIcon from '@material-design-icons/svg/filled/email.svg?component'
import GithubIcon from '@/assets/github.svg?component'
import LinkedInIcon from '@/assets/linkedin.svg?component'
import LightModeIcon from '@/assets/lightMode.svg?component'
import DarkModeIcon from '@/assets/darkMode.svg?component'

import { useTheme } from '@/composables/useTheme'

const { isLight, updateTheme } = useTheme()
</script>
<style lang="scss" scoped>
.nav {
  display: flex;
  min-height: var(--size-8);
  align-items: center;
}

.nav-left {
  flex-grow: 1;

  &-item {
    margin: 0 var(--size-2);
    font-size: 36px;
    text-decoration: none;
  }

  a {
    color: var(--brand);
  }
}

.nav-right {
  display: flex;
  align-items: center;

  &-item {
    margin: 0 var(--size-3);
  }
}

.theme-toggle {
  margin-left: var(--size-3);
  background: none;
}

.email-icon {
  width: 24px;
  height: 24px;
  fill: currentcolor;
}

.fade-mode-icon-enter-from,
.fade-mode-icon-leave-to {
  opacity: 0;
}

.fade-mode-icon-enter-active {
  transition: opacity 0.3s ease-out;
}

.fade-mode-icon-leave-active {
  transition: opacity 0.3s ease-in;
}

.fade-mode-icon-enter-to,
.fade-mode-icon-leave-from {
  opacity: 1;
}
</style>
