import { SafeHtml } from '@angular/platform-browser';

export type Environment = {
  name: string;
  production: boolean;
  stage: boolean;
};
export type Theme = 'light' | 'light-mc' | 'light-hc' | 'dark' | 'dark-mc' | 'dark-hc';
export type Locale = 'ru' | 'en-US';
export type LocaleJson = {
  locale: Locale;
  translations: Record<string, string>;
};
export type Icon = 'arrow-bottom' | 'arrow-left' | 'error' | 'file-search' | 'info' | 'palette' | 'print' | 'settings' | 'trash' | 'world';
export type IconState = {
  iconSvg: SafeHtml | null;
  isLoading: boolean;
  isLoadError: boolean;
};
export type IconSvgParams = {
  width: string;
  height: string;
};
