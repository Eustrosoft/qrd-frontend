import { Icon, Locale, Theme, ThemeContrast } from '@app/app.models';
import { Column, SettingsDto } from '@api/settings/settings-api.models';

export const AppRoutes = {
  login: 'login',
  qrCards: 'qr-cards',
  qrCard: 'qr-card',
  attrs: 'attributes',
  templates: 'templates',
  template: 'template',
  files: 'files',
  file: 'file',
  usages: 'usages',
  new: 'new',
  edit: 'edit',
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

export const ALL_QR_TABLE_COLS: Column[] = [
  {
    type: 'qr_image',
    fieldName: 'code_picture',
    name: 'QR Picture',
    enable: true,
  },
  {
    type: 'qr_code',
    fieldName: 'code',
    name: 'QR Code',
    enable: true,
  },
  {
    type: 'text',
    fieldName: 'name',
    name: 'Name',
    enable: true,
  },
  {
    type: 'text',
    fieldName: 'description',
    name: 'Description',
    enable: true,
  },
  {
    type: 'date',
    fieldName: 'created',
    name: 'Создана',
    enable: true,
  },
  {
    type: 'date',
    fieldName: 'updated',
    name: 'Отредактирована',
    enable: true,
  },
];
export const DEFAULT_SETTINGS: SettingsDto['settings'] = {
  language: 'en-US',
  qrTableColumns: [ALL_QR_TABLE_COLS[0], ALL_QR_TABLE_COLS[1], ALL_QR_TABLE_COLS[2], ALL_QR_TABLE_COLS[3]],
  defaultQrPrintText: '',
  defaultQrPrintTextDown: '',
  checkUploadSize: true,
};
