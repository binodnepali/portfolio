import { ThemeMode } from '~~/types/ThemeMode';

export function useTheme() {
  const dark = ref(ThemeMode.Dark);

  const updateDataTheme = (themeMode: ThemeMode) => {
    const html = document.querySelector('html');
    html?.setAttribute('data-theme', themeMode);
  };

  const updateTheme = (themeMode: ThemeMode) => {
    dark.value = themeMode;
    updateDataTheme(themeMode);
  };

  const mediaQueryListEventChange = (
    mediaQueryListEvent: MediaQueryListEvent
  ) => {
    dark.value = mediaQueryListEvent?.matches
      ? ThemeMode.Dark
      : ThemeMode.Light;
    updateDataTheme(dark.value);
  };

  onMounted(() => {
    dark.value = window.matchMedia('(prefers-color-scheme: dark)')?.matches
      ? ThemeMode.Dark
      : ThemeMode.Light;
    updateDataTheme(dark.value);
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', mediaQueryListEventChange);
  });

  onUnmounted(() =>
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .removeEventListener('change', mediaQueryListEventChange)
  );

  return {
    isDark: computed(() => dark.value === ThemeMode.Dark),
    isLight: computed(() => dark.value === ThemeMode.Light),
    updateTheme,
  };
}
