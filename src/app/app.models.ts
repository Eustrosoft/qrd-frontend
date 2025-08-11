export type Environment = {
  name: string;
  production: boolean;
  stage: boolean;
  baseHref: string;
};
export type Theme = 'system' | 'light' | 'dark';
export type ThemeContrast = '' | '-mc' | '-hc';
export type Locale = 'ru-RU' | 'en-US' | 'bg-BG';
export type LocaleJson = {
  locale: Locale;
  translations: Record<string, string>;
};
export type Icon = 'arrow-bottom' | 'cringe' | 'not-found' | 'palette' | 'timeout' | 'unknown-err';
export type Dictionaries =
  | 'locales'
  | 'themes'
  | 'contrast'
  | 'headerNavbarLinks'
  | 'bottomNavbarLinks'
  | 'INPUT_TYPE'
  | 'qrCardActions';
export type DictionaryState<T> = {
  list: T[];
  isLoading: boolean;
  isLoadError: boolean;
};
export interface GenericButton {
  buttonText: string;
  buttonAction: (() => void) | null;
}
