import { Theme, ThemeContrast } from '@app/app.models';

export const AppRoutes = {
  login: 'login',
  cards: 'cards',
  templates: 'templates',
  files: 'files',
  notFound: 'not-found',
  unauthenticated: 'unauthenticated',
  devSandbox: 'dev-sandbox',
} as const;

export const THEME_KEY = 'qrd-user-theme';
export const THEME_CONTRAST_KEY = 'qrd-user-theme-contrast';
export const LOCALE_KEY = 'qrd-user-locale';
export const IS_AUTHENTICATED_KEY = 'qrd-user-is-authenticated';

export const THEMES = new Set<Theme>(['system', 'light', 'dark']);
export const THEMES_CONTRAST = new Set<ThemeContrast>(['', '-mc', '-hc']);
