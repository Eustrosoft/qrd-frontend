export const SharedLocalization = {
  get login() {
    return $localize`:@@shared.login:Login`;
  },
  get logout() {
    return $localize`:@@shared.logout:Logout`;
  },
  get settings() {
    return $localize`:@@shared.settings:Settings`;
  },
  get language() {
    return $localize`:@@shared.language:Language`;
  },
  get mainPage() {
    return $localize`:@@shared.mainPage:Main`;
  },
  get defaultTitle() {
    return $localize`:@@shared.defaultTitle:QRD`;
  },
} as const;

export const LocalesLocalization = {
  get ru() {
    return $localize`:@@locales.ru:Russian`;
  },
  get enUS() {
    return $localize`:@@locales.enUS:English (US)`;
  },
} as const;

export const RouteTitles = {
  get login() {
    return $localize`:@@routes.login:Login`;
  },
  get cards() {
    return $localize`:@@routes.cards:Cards`;
  },
  get templates() {
    return $localize`:@@routes.templates:Templates`;
  },
  get files() {
    return $localize`:@@routes.files:Files`;
  },
  get docs() {
    return $localize`:@@routes.docs:Docs`;
  },
  get devSandbox() {
    return $localize`:@@routes.devSandbox:Dev Sandbox`;
  },
} as const;
