export type Environment = {
  name: string;
  production: boolean;
  stage: boolean;
};
export type Theme = 'system' | 'light' | 'dark';
export type ThemeContrast = '' | '-mc' | '-hc';
export type Locale = 'ru-RU' | 'en-US';
export type LocaleJson = {
  locale: Locale;
  translations: Record<string, string>;
};
export type Icon = 'arrow-bottom' | 'cringe' | 'not-found' | 'palette' | 'timeout';
export type Dictionaries = 'locales' | 'themes' | 'contrast' | 'headerNavbarLinks' | 'bottomNavbarLinks';
export type DictionaryState<T> = {
  list: T[];
  isLoading: boolean;
  isLoadError: boolean;
};
