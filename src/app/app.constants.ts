import { Theme } from '@app/app.models';

export const AppRoutes = {
  DEV_SANDBOX: 'dev-sandbox',
  NOT_FOUND: 'not-found',
} as const;

export const RouteTitles = {
  NOT_FOUND: $localize`Страница не найдена`,
  DEV_SANDBOX: $localize`Dev Sandbox`,
} as const;

export const THEME_KEY = 'qrd-user-theme' as const;

export const THEME_LIST = new Set<Theme>(['light', 'light-mc', 'light-hc', 'dark', 'dark-mc', 'dark-hc']);
