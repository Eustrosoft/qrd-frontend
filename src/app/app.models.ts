import { SafeHtml } from '@angular/platform-browser';
import { Option } from '@shared/shared.models';

export type Environment = {
  name: string;
  production: boolean;
  stage: boolean;
};
export type Theme = 'system' | 'light' | 'dark';
export type ThemeContrast = '' | '-mc' | '-hc';
export type Locale = 'ru' | 'en-US';
export type LocaleJson = {
  locale: Locale;
  translations: Record<string, string>;
};
export type Icon =
  | 'arrow-bottom'
  | 'arrow-left'
  | 'close'
  | 'error'
  | 'eye'
  | 'eye-slash'
  | 'file-search'
  | 'info'
  | 'not-found'
  | 'palette'
  | 'print'
  | 'settings'
  | 'sidenav'
  | 'table'
  | 'trash'
  | 'user-circle'
  | 'world';
export type IconState = {
  iconSvg: SafeHtml | null;
  isLoading: boolean;
  isLoadError: boolean;
};
export type Dictionaries = 'locales' | 'themes' | 'contrast';
export type DictionaryState<T = Option<unknown>> = {
  list: T[];
  isLoading: boolean;
  isLoadError: boolean;
};
export type IconSvgParams = {
  width: string;
  height: string;
};
