export const SharedLocalization = {
  login: $localize`:@@shared.login:Login`,
  logout: $localize`:@@shared.logout:Logout`,
  settings: $localize`:@@shared.settings:Settings`,
  language: $localize`:@@shared.language:Language`,
  mainPage: $localize`:@@shared.mainPage:Main`,
  defaultTitle: $localize`:@@shared.defaultTitle:QRD`,
  search: $localize`:@@shared.search:Search`,
  list: $localize`:@@shared.list:List`,
  table: $localize`:@@shared.table:Table`,
  edit: $localize`:@@shared.edit:Edit`,
  print: $localize`:@@shared.print:Print`,
  delete: $localize`:@@shared.delete:Delete`,
  selected: $localize`:@@shared.selected:Selected`,
  selectAll: $localize`:@@shared.selectAll:Select all`,
} as const;

export const LocalesLocalization = {
  ru: $localize`:@@locales.ru:Russian`,
  enUS: $localize`:@@locales.enUS:English (US)`,
} as const;

export const RouteTitles = {
  login: $localize`:@@routes.login:Login`,
  cards: $localize`:@@routes.cards:Cards`,
  templates: $localize`:@@routes.templates:Templates`,
  files: $localize`:@@routes.files:Files`,
  docs: $localize`:@@routes.docs:Docs`,
  devSandbox: $localize`:@@routes.devSandbox:Dev Sandbox`,
} as const;
