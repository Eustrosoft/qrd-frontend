export const SharedLocalization = {
  login: $localize`:@@shared.login:Login`,
  logout: $localize`:@@shared.logout:Logout`,
  settings: $localize`:@@shared.settings:Settings`,
  language: $localize`:@@shared.language:Language`,
  mainPage: $localize`:@@shared.mainPage:Main`,
  defaultTitle: $localize`:@@shared.defaultTitle:QRD`,
  name: $localize`:@@shared.name:Name`,
  noName: $localize`:@@shared.noName:No name`,
  description: $localize`:@@shared.description:Description`,
  noDescription: $localize`:@@shared.noDescription:No description`,
  template: $localize`:@@shared.template:Template`,
  noTemplate: $localize`:@@shared.noTemplate:No template`,
  card: $localize`:@@shared.card:Card`,
  search: $localize`:@@shared.search:Search`,
  list: $localize`:@@shared.list:List`,
  table: $localize`:@@shared.table:Table`,
  open: $localize`:@@shared.open:Open`,
  edit: $localize`:@@shared.edit:Edit`,
  print: $localize`:@@shared.print:Print`,
  delete: $localize`:@@shared.delete:Delete`,
  selected: $localize`:@@shared.selected:Selected`,
  selectAll: $localize`:@@shared.selectAll:Select all`,
} as const;

export const SizeUnitsLocalization = {
  b: $localize`:@@sizeUnits.bytes:B`,
  kb: $localize`:@@sizeUnits.kb:KB`,
  mb: $localize`:@@sizeUnits.mb:MB`,
  gb: $localize`:@@sizeUnits.gb:GB`,
  tb: $localize`:@@sizeUnits.tb:TB`,
  pb: $localize`:@@sizeUnits.pb:PB`,
  eb: $localize`:@@sizeUnits.eb:EB`,
  zb: $localize`:@@sizeUnits.zb:ZB`,
  yb: $localize`:@@sizeUnits.yb:YB`,
};

export const LocalesLocalization = {
  ruRu: $localize`:@@locales.ruRu:Russian`,
  enUS: $localize`:@@locales.enUS:English (US)`,
} as const;

export const RouteTitles = {
  login: $localize`:@@routes.login:Login`,
  cards: $localize`:@@routes.cards:Cards`,
  card: $localize`:@@routes.card:Card`,
  attrs: $localize`:@@routes.attrs:Attributes`,
  templates: $localize`:@@routes.templates:Templates`,
  files: $localize`:@@routes.files:Files`,
  docs: $localize`:@@routes.docs:Docs`,
  devSandbox: $localize`:@@routes.devSandbox:Dev Sandbox`,
} as const;
