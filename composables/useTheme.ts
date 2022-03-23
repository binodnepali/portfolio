import { ref, onMounted, onUnmounted } from 'vue';

export function useTheme() {
  const isDark = ref(false);

  const mediaQueryListEventChange = (
    mediaQueryListEvent: MediaQueryListEvent
  ) => {
    isDark.value = mediaQueryListEvent.matches;
  };

  onMounted(() => {
    isDark.value =
      window.matchMedia('(prefers-color-scheme: dark)').matches || false;
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', mediaQueryListEventChange);
  });
  onUnmounted(() =>
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .removeEventListener('change', mediaQueryListEventChange)
  );

  return { isDark };
}
