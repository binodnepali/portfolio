import { ThemeMode } from '@/types/ThemeMode';

export function useTheme() {
  const theme = ref(ThemeMode.Light);

  const updateDataTheme = (themeMode: ThemeMode) => {
    const html = document.querySelector('html');
    html?.setAttribute('data-theme', themeMode);
  };

  const updateTheme = () => {
    const newTheme =
      theme.value === ThemeMode.Light ? ThemeMode.Dark : ThemeMode.Light;
    theme.value = newTheme;
    updateDataTheme(newTheme);
  };

  const mediaQueryListEventChange = (
    mediaQueryListEvent: MediaQueryListEvent
  ) => {
    theme.value = mediaQueryListEvent?.matches
      ? ThemeMode.Dark
      : ThemeMode.Light;
    updateDataTheme(theme.value);
  };

  onMounted(() => {
    theme.value = window.matchMedia('(prefers-color-scheme: dark)')?.matches
      ? ThemeMode.Dark
      : ThemeMode.Light;
    updateDataTheme(theme.value);
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
    isDark: computed(() => theme.value === ThemeMode.Dark),
    isLight: computed(() => theme.value === ThemeMode.Light),
    updateTheme,
  };
}
