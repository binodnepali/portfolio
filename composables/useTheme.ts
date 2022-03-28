import { inject, computed } from 'vue';

import { themeKey, ThemeInjectionKey } from '@/constants/ProviderKeys';
import { ThemeMode } from '@/types/ThemeMode';

export function useTheme() {
  const { theme, updateTheme } = inject<ThemeInjectionKey>(themeKey);

  const isDark = computed(() => {
    return theme.value === ThemeMode.Dark;
  });

  return { isDark, updateTheme };
}
