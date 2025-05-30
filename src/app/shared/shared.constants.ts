export const SharedLocalization = {
  get login() {
    return $localize`:@@shared.login:Войти`;
  },
  get logout() {
    return $localize`:@@shared.logout:Выйти`;
  },
  get settings() {
    return $localize`:@@shared.settings:Настройки`;
  },
  get language() {
    return $localize`:@@shared.language:Язык`;
  },
  get mainPage() {
    return $localize`:@@shared.mainPage:Главная страница`;
  },
  get defaultTitle() {
    return $localize`:@@shared.defaultTitle:QRD`;
  },
} as const;

export const LocalesLocalization = {
  get ru() {
    return $localize`:@@locales.ru:Русский`;
  },
  get enUS() {
    return $localize`:@@locales.enUS:Английский (США)`;
  },
} as const;

export const RouteTitles = {
  get login() {
    return $localize`:@@routes.login:Вход`;
  },
  get cards() {
    return $localize`:@@routes.cards:Карточки`;
  },
  get templates() {
    return $localize`:@@routes.templates:Шаблоны`;
  },
  get files() {
    return $localize`:@@routes.files:Файлы`;
  },
  get devSandbox() {
    return $localize`:@@routes.devSandbox:Dev Sandbox`;
  },
} as const;
