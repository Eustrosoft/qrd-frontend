import { SafeHtml } from '@angular/platform-browser';

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
export type Icon =
  | 'add-content'
  | 'arrow-bottom'
  | 'arrow-left'
  | 'cards'
  | 'close'
  | 'cringe'
  | 'doc'
  | 'error'
  | 'eye'
  | 'eye-slash'
  | 'file-search'
  | 'folder'
  | 'folder-open'
  | 'grid-plus'
  | 'info'
  | 'not-found'
  | 'palette'
  | 'print'
  | 'settings'
  | 'sidenav'
  | 'table'
  | 'template'
  | 'timeout'
  | 'trash'
  | 'user-circle'
  | 'world';
export type IconState = {
  iconSvg: SafeHtml | null;
  isLoading: boolean;
  isLoadError: boolean;
};
export type Dictionaries = 'locales' | 'themes' | 'contrast' | 'headerNavbarLinks' | 'bottomNavbarLinks';
export type DictionaryState<T> = {
  list: T[];
  isLoading: boolean;
  isLoadError: boolean;
};
export type IconSvgParams = {
  width: string;
  height: string;
};
