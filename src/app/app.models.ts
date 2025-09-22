export type Environment = {
  name: string;
  production: boolean;
  preproduction: boolean;
  dev: boolean;
  baseHref: string;
};
export type Theme = 'system' | 'light' | 'dark';
export type ThemeContrast = '' | '-mc' | '-hc';
export type Locale = 'ru-RU' | 'en-US' | 'bg-BG';
export type LocaleJson = {
  locale: Locale;
  translations: Record<string, string>;
};

export type ConfigUri = { title?: string; uri?: string; disabled?: boolean };
export type ConfigLocaleItem = { lang?: Locale; name?: string; default?: boolean };
export type AppConfig = {
  qrdConf?: {
    signUpUri?: ConfigUri;
    forgotPassUri?: ConfigUri;
    oldAppUri?: ConfigUri;
    qrgenUri?: string;
    langList?: ConfigLocaleItem[];
  };
};
export type ConfigImgUri = { uri?: string; alt?: string };
export type ConfigLinkItem = { title?: string; uri?: string };
export type ConfigNavItem = { title?: string; uri?: string; icon?: string; iconActive?: string };
export type ConfigFooterBlock = { title?: string; links?: ConfigLinkItem[] };
export type AppLayoutConfig = {
  logo?: ConfigImgUri;
  header: {
    title?: string;
    tagline?: string;
    nav?: ConfigNavItem[];
  };
  footer: {
    title?: string;
    tagline?: string;
    blocks?: ConfigFooterBlock[];
    copyright?: ConfigLinkItem;
  };
};

export type Icon = 'arrow-bottom' | 'cringe' | 'not-found' | 'palette' | 'timeout' | 'unknown-err';
export type Dictionaries = 'locales' | 'themes' | 'contrast' | 'INPUT_TYPE' | 'qrCardActions';
export type DictionaryState<T> = {
  list: T[];
  isLoading: boolean;
  isLoadError: boolean;
};
export interface GenericButton {
  buttonText: string;
  buttonAction: (() => void) | null;
}
