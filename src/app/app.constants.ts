import { Icon, Locale, Theme, ThemeContrast } from '@app/app.models';

export const AppRoutes = {
  login: 'login',
  qrCards: 'qr-cards',
  qrCard: 'qr-card',
  attrs: 'attributes',
  templates: 'templates',
  template: 'template',
  files: 'files',
  file: 'file',
  docs: 'docs',
  doc: 'doc',
  gs1: 'gs1',
  pCodes: 'pin-codes',
  pCode: 'pin-code',
  usages: 'usages',
  list: 'list',
  table: 'table',
  new: 'new',
  edit: 'edit',
  settings: 'settings',
  deeplink: 'deeplink',
  password: 'password',
  notFound: 'not-found',
  unauthenticated: 'unauthenticated',
  devSandbox: 'dev-sandbox',
} as const;

export const THEME_KEY = 'qrd-user-theme';
export const THEME_CONTRAST_KEY = 'qrd-user-theme-contrast';
export const LOCALE_KEY = 'qrd-user-locale';
export const IS_AUTHENTICATED_KEY = 'qrd-user-is-authenticated';
export const VIEW_MODE_SETTINGS_KEY = 'qrd-view-mode-settings';

export const THEMES = new Set<Theme>(['system', 'light', 'dark']);
export const THEMES_CONTRAST = new Set<ThemeContrast>(['', '-mc', '-hc']);

export const DEFAULT_LOCALE: Locale = 'en-US';

export const CUSTOM_ICONS_NAMESPACE = 'qrd';
export const CUSTOM_ICON_MAP = new Map<Icon, string>([
  ['arrow-bottom', 'public/icons/arrow-bottom.svg'],
  ['cringe', 'public/icons/cringe.svg'],
  ['palette', 'public/icons/palette.svg'],
  ['not-found', 'public/icons/not-found.svg'],
  ['timeout', 'public/icons/timeout.svg'],
  ['unknown-err', 'public/icons/unknown-err.svg'],
]);

export const DEFAULT_EMPTY_ID = -1;
export const SKELETON_TIMER = 300;
export const DEFAULT_ITEMS_PER_PAGE = 20;
export const QR_API_URL = '/qr/?q=';
