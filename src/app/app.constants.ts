export const AppRoutes = {
  LOGIN: 'login',
  CARDS: 'cards',
  TEMPLATES: 'templates',
  FILES: 'files',
  DEV_SANDBOX: 'dev-sandbox',
  NOT_FOUND: 'not-found',
} as const;

export const RouteTitles = {
  LOGIN: $localize`Вход`,
  CARDS: $localize`Карточки`,
  TEMPLATES: $localize`Шаблоны`,
  FILES: $localize`Файлы`,
  NOT_FOUND: $localize`Страница не найдена`,
  DEV_SANDBOX: $localize`Dev Sandbox`,
} as const;

export const THEME_KEY = 'qrd-user-theme' as const;
export const LOCALE_KEY = 'qrd-user-locale' as const;
