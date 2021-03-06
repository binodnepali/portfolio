import { Ref, InjectionKey } from 'vue';

import { ThemeMode } from '@/types/ThemeMode';

export type ThemeInjectionKey = {
  theme: Ref<ThemeMode>;
  updateTheme: (themeMode: ThemeMode) => void;
};
export const themeKey = Symbol() as InjectionKey<ThemeInjectionKey>;
